from pathlib import Path
import shutil
import zipfile
from backend.models import DatabaseSchema, GraphData, ModuleNode, SymbolNode, SymbolDependencyEdge, ModuleDependencyEdge
from backend.constants import JS_PARSER, text_splitter, openai_llm, SCHEMA_PROMPT
from langchain.chains import LLMChain
from langchain.output_parsers.json import SimpleJsonOutputParser
from langchain_core.output_parsers import JsonOutputParser
from langchain.output_parsers import OutputFixingParser
from typing import Optional
from fastapi import UploadFile
from langchain_community.document_loaders import PyPDFLoader
from langchain.prompts import PromptTemplate
import ast
import os

def parse_symbol_from_source(source_code: str, symbol_name: str) -> tuple[Optional[str], Optional[str]]:
    try:
        tree = ast.parse(source_code)

        def find_symbol(node):
            if isinstance(node, ast.FunctionDef) and node.name == symbol_name:
                return ast.get_source_segment(source_code, node), "function"
            elif isinstance(node, ast.ClassDef) and node.name == symbol_name:
                return ast.get_source_segment(source_code, node), "class"
            elif isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id == symbol_name:
                        return ast.get_source_segment(source_code, node), "variable"
            return None, None

        for node in ast.walk(tree):
            symbol_code, symbol_type = find_symbol(node)
            if symbol_code:
                return symbol_code, symbol_type

        return None, None
    except Exception as e:
        print(f"Error parsing symbol {symbol_name}: {str(e)}")
        return None, None

def clear_graph(tx):
    tx.run("MATCH (n) DETACH DELETE n")

def add_module_node(tx, moduleNode: ModuleNode):
    is_package = moduleNode.modulePath.startswith('@')
    query = """
    MERGE (m:Module {
        moduleName: $moduleName,
        modulePath: $modulePath
    })
    SET m:Package
    REMOVE m:RegularModule
    """
    if not is_package:
        query = """
        MERGE (m:Module {
            moduleName: $moduleName,
            modulePath: $modulePath,
            moduleSourceCode: $moduleSourceCode
        })
        SET m:RegularModule
        REMOVE m:Package
        """
    tx.run(query, 
           moduleName=moduleNode.moduleName,
           modulePath=moduleNode.modulePath,
           moduleSourceCode=moduleNode.moduleSourceCode)

def add_symbol_node(tx, symbolNode: SymbolNode):
    query = """
    MERGE (s:Symbol {symbolName: $symbolName, symbolModulePath: $symbolModulePath})
    """
    tx.run(query, symbolName=symbolNode.symbolName, symbolModulePath=symbolNode.symbolModulePath)

def add_symbol_dependency_edge(tx, edge: SymbolDependencyEdge):
    query_depends = """
    MATCH (m:Module {modulePath: $dependentModulePath})
    MATCH (s:Symbol {symbolName: $dependencySymbolName, symbolModulePath: $dependencySymbolPath})
    MERGE (m)-[r:DEPENDS_ON]->(s)
    """
    tx.run(query_depends,
           dependentModulePath=edge.dependentModulePath,
           dependencySymbolPath=edge.dependencySymbolPath,
           dependencySymbolName=edge.dependencySymbolName)

def add_module_dependency_edge(tx, edge: ModuleDependencyEdge):
    query = """
    MATCH (m1:Module {modulePath: $dependentModulePath})
    MERGE (m2:Module {modulePath: $dependencyModulePath})
    MERGE (m1)-[r:DEPENDS_ON]->(m2)
    """
    tx.run(query,
           dependentModulePath=edge.dependentModulePath,
           dependencyModulePath=edge.dependencyModulePath)

def add_package_exports(tx, edge: SymbolDependencyEdge):
    query_exports = """
    MATCH (m:Module {modulePath: $dependencySymbolPath})
    MATCH (s:Symbol {symbolName: $dependencySymbolName, symbolModulePath: $dependencySymbolPath})
    MERGE (m)-[r:EXPORTS]->(s)
    """
    tx.run(query_exports,
           dependencySymbolPath=edge.dependencySymbolPath,
           dependencySymbolName=edge.dependencySymbolName)

def add_symbol_source_code_node(tx, symbolNode: SymbolNode):
    if not symbolNode.symbolModulePath.startswith('@'):
        query_get_module = """
        MATCH (m:Module {modulePath: $symbolModulePath})
        RETURN m.moduleSourceCode as sourceCode
        """
        result = tx.run(query_get_module, symbolModulePath=symbolNode.symbolModulePath).single()
        
        if result and result["sourceCode"]:
            symbol_code, symbol_type = parse_symbol_from_source(
                result["sourceCode"],
                symbolNode.symbolName
            )
        else:
            symbol_code, symbol_type = None, None
        query = """
        MERGE (s:Symbol {symbolName: $symbolName, symbolModulePath: $symbolModulePath})
        SET s.symbolCode = $symbolCode,
            s.symbolType = $symbolType
        """
        tx.run(query,
            symbolName=symbolNode.symbolName,
            symbolModulePath=symbolNode.symbolModulePath,
            symbolCode=symbol_code,
            symbolType=symbol_type)
    else:
        query = """
        MERGE (s:Symbol {symbolName: $symbolName, symbolModulePath: $symbolModulePath})
        """
        tx.run(query,
            symbolName=symbolNode.symbolName,
            symbolModulePath=symbolNode.symbolModulePath)
        
def update_module_embeddings(tx, module_path: str, embeddings: list):
    query = """
    MATCH (m:Module {modulePath: $modulePath})
    SET m.moduleSourceCodeEmbeddings = $embeddings
    """
    tx.run(query, modulePath=module_path, embeddings=embeddings)

def update_symbol_embeddings(tx, symbol_name: str, symbol_module_path: str, embeddings: list):
    query = """
    MATCH (s:Symbol {symbolName: $symbolName, symbolModulePath: $symbolModulePath})
    SET s.symbolCodeEmbeddings = $embeddings
    """
    tx.run(query, 
           symbolName=symbol_name, 
           symbolModulePath=symbol_module_path, 
           embeddings=embeddings)
    
def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    chain = LLMChain(llm=openai_llm, prompt=prompt, output_parser=SimpleJsonOutputParser())
    return chain

async def convert_brd_to_schema(file: UploadFile) -> dict:
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as temp_file:
        content = await file.read()
        temp_file.write(content)

    loader = PyPDFLoader(temp_file_path)
    pages = loader.load()
    
    text = " ".join([page.page_content for page in pages])
    chunks = text_splitter.split_text(text)
    
    chain = SCHEMA_PROMPT | openai_llm | OutputFixingParser.from_llm(parser=JsonOutputParser(pydantic_object=DatabaseSchema),llm=openai_llm)
    
    os.remove(temp_file_path)
    return chain.invoke({"text" : chunks})

async def convert_query_to_schema(query):
    chain = SCHEMA_PROMPT | openai_llm | OutputFixingParser.from_llm(parser=JsonOutputParser(pydantic_object=DatabaseSchema),llm=openai_llm)

    return chain.invoke({"text" : query})


async def convert_zip_to_graph(file: UploadFile) -> dict:
    temp_zip_path = f"temp_{file.filename}"
    temp_extract_path = Path("temp_extract")

    with open(temp_zip_path, "wb") as temp_file:
        content = await file.read()
        temp_file.write(content)

    with zipfile.ZipFile(temp_zip_path, 'r') as zip_ref:
        zip_ref.extractall(temp_extract_path)

    text = ""
    for path in temp_extract_path.rglob("*"):
        if path.is_file() and path.suffix in {".js", ".json", ".md", ".txt"}:  
            relative_path = path.relative_to(temp_extract_path)
            with open(path, "r", encoding="utf-8") as f:
                file_content = f.read()
            text += f"\n\n---\nFile: {relative_path}\n\n{file_content}\n\n"

    print(text)
    
    chunks = text_splitter.split_text(text)
    chain = JS_PARSER | openai_llm | OutputFixingParser.from_llm(
        parser=JsonOutputParser(pydantic_object=GraphData), llm=openai_llm
    )

    os.remove(temp_zip_path)
    shutil.rmtree(temp_extract_path)  

    return chain.invoke({"text": chunks})

def filter_properties(properties: dict) -> dict:
    """Filter out moduleSourceCodeEmbeddings from properties"""
    return {k: v for k, v in properties.items() if k != 'moduleSourceCodeEmbeddings'}