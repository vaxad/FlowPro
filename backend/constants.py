from neo4j import GraphDatabase
from dotenv import load_dotenv
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from neo4j_graphrag.retrievers import HybridRetriever
from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.generation import GraphRAG
import os

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
embeddings_model = OpenAIEmbeddings()
graph = Neo4jGraph(
    url=NEO4J_URI,
    username=NEO4J_USER,
    password=NEO4J_PASSWORD,
)

openai_llm = ChatOpenAI(temperature=0, model_name="gpt-4o")

cypher_chain = GraphCypherQAChain.from_llm(
    cypher_llm=openai_llm,
    qa_llm=openai_llm,
    graph=graph,
    verbose=True,
    return_intermediate_steps=True,
    allow_dangerous_requests=True,
)

retriever = HybridRetriever(
    driver=driver,
    vector_index_name="moduleEmdeddings",
    fulltext_index_name="moduleFullText",
    embedder=embeddings_model,
    return_properties=["moduleSourceCode", "moduleName","modulePath"],
)

llm = OpenAILLM(model_name="gpt-4o", model_params={"temperature": 0})
rag = GraphRAG(retriever=retriever, llm=llm)

SCHEMA_PROMPT = ChatPromptTemplate.from_template("""
Analyze the following text and create a JSON-format database schema using this structure:
{{
    "name": "Generated Schema",
    "description": "Schema generated from PDF content",
    "entities": [
        {{
            "name": "entity_name",
            "attributes": [
                {{
                    "name": "attribute_name",
                    "type": "attribute_type",
                    "constraint": {{
                        "value": "constraint_value",
                        "type": "constraint_type"
                    }}
                }}
            ]
        }}
    ],
    "relations": [
        {{
            "from": "entity_name",
            "to": "related_entity",
            "type": "1-?1 | 1-m | m-1 | 1?-1",
            "name": "relation_name",
            "attributes": [
                {{
                    "name": "attribute_name",
                    "type": "attribute_type",
                    "constraint": {{
                        "value": "constraint_value",
                        "type": "constraint_type"
                    }}
                }}
            ]
        }}
    ],
    "auth": true
}}

Text content:
{text}

Guidelines:
- `attribute_type` is limited to the following: "string", "number", "boolean", "Date"".
- `constraint_type` options include: "required", "unique", "optional", or "default".
- Avoid including primary or foreign keys in the schema.
- Generate a comprehensive database schema based on the entities and relationships identified in the text.
"""
)

JS_PARSER = ChatPromptTemplate.from_template("""
Analyze the following code and create dependency graph schema in JSON format following this structure:
{{
    "moduleDependencyEdges": [
        {{
            "dependentModulePath": "STRING",   // Path of the module that depends on another module
            "dependencyModulePath": "STRING"   // Path of the module being depended on
        }}, 
        {{
            "dependentModulePath": "STRING",   // Path of the module that depends on another module
            "dependencyModulePath": "STRING"   // Path of the module being depended on
        }}  
    ],
    "moduleNodes": [
        {{
            "moduleName": "STRING",           // Name of the module
            "modulePath": "STRING",           // File path of the module in the codebase
            "moduleSourceCode": "STRING"      // Source code for the module
        }},
        {{
            "moduleName": "STRING",           // Name of the module
            "modulePath": "STRING",           // File path of the module in the codebase
            "moduleSourceCode": "STRING"      // Source code for the module
        }}
    ],
    "symbolDependencyEdges": [
        {{
            "dependentModulePath": "STRING",   // Path of the module that depends on a symbol
            "dependencySymbolPath": "STRING",  // Path of the module where the symbol is defined
            "dependencySymbolName": "STRING"   // Name of the symbol that is depended on
        }},
        {{
            "dependentModulePath": "STRING",   // Path of the module that depends on a symbol
            "dependencySymbolPath": "STRING",  // Path of the module where the symbol is defined
            "dependencySymbolName": "STRING"   // Name of the symbol that is depended on
        }}
    ],
    "symbolNodes": [
        {{
            "symbolModulePath": "STRING",       // Path of the module where the symbol is located
            "symbolName": "STRING"              // Name of the symbol
        }},
        {{
            "symbolModulePath": "STRING",       // Path of the module where the symbol is located
            "symbolName": "STRING"              // Name of the symbol
        }}
    ]
}}

Text content:
{text}
Generate a comprehensive dependency graph schema based on the entities and relationships identified in the code.
"""
)

text_splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=2000,
    chunk_overlap=200,
    length_function=len
)