from pydantic import BaseModel
from typing import List, Optional

class ModuleNode(BaseModel):
    moduleName: str
    modulePath: str
    moduleSourceCode: Optional[str] = None

class SymbolNode(BaseModel):
    symbolName: str
    symbolModulePath: str
    symbolCode: Optional[str] = None
    symbolType: Optional[str] = None

class SymbolDependencyEdge(BaseModel):
    dependentModulePath: str
    dependencySymbolPath: str
    dependencySymbolName: str

class ModuleDependencyEdge(BaseModel):
    dependentModulePath: str
    dependencyModulePath: str

class GraphData(BaseModel):
    moduleNodes: Optional[List[ModuleNode]] = None
    symbolNodes: Optional[List[SymbolNode]] = None
    symbolDependencyEdges: Optional[List[SymbolDependencyEdge]] = None
    moduleDependencyEdges: Optional[List[ModuleDependencyEdge]] = None

class QueryRequest(BaseModel):
    query: str
    
class EmbeddingsResponse(BaseModel):
    message: str
    processed_count: int