from typing import List, Optional, Literal
from pydantic import BaseModel

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
    
class Constraint(BaseModel):
    value: Optional[str] = None
    type: Literal["required", "unique", "optional", "default"]

class Attribute(BaseModel):
    name: str
    type: Literal["string", "number", "boolean", "Date"]
    constraint: Optional[Constraint] = None

class Entity(BaseModel):
    name: str
    attributes: List[Attribute]

class Relation(BaseModel):
    from_: str
    to: str
    type: Literal["1-?1", "1-m", "m-1", "1?-1"]
    name: str
    attributes: Optional[List[Attribute]] = None

class DatabaseSchema(BaseModel):
    name: str
    description: str
    entities: List[Entity]
    relations: List[Relation]
    auth: bool