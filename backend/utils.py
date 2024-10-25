import ast
from typing import Optional
from backend.models import ModuleNode, SymbolNode, SymbolDependencyEdge, ModuleDependencyEdge

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