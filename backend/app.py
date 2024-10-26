from urllib import response
from backend.models import EmbeddingsResponse, GraphData
from backend.constants import cypher_chain, embeddings_model
from backend.models import QueryRequest
from backend.constants import driver, rag
from backend.utils import add_module_node, add_package_exports, add_symbol_node, add_symbol_dependency_edge, add_module_dependency_edge, add_symbol_source_code_node, clear_graph, convert_brd_to_schema, convert_query_to_schema, convert_zip_to_graph, filter_properties, update_module_embeddings, update_symbol_embeddings
from typing import Dict
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/add_nodes")
async def add_nodes(graph_data: GraphData):
    try:
        with driver.session() as session:
            session.write_transaction(clear_graph)
            if graph_data.moduleNodes:
                for module in graph_data.moduleNodes:
                    session.write_transaction(add_module_node, module)
            
            if graph_data.symbolNodes:
                for symbol in graph_data.symbolNodes:
                    session.write_transaction(add_symbol_node, symbol)
        return {"message": "add_nodes data added successfully"}         
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/add_exports")
async def add_exports(graph_data: GraphData):
    try:
        with driver.session() as session:
            if graph_data.symbolDependencyEdges:
                for edge in graph_data.symbolDependencyEdges:
                    session.write_transaction(add_package_exports, edge)
        return {"message": "add_exports data added successfully"}       
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/add_symbol_dependency")
async def add_symbol_dependency(graph_data: GraphData):
    try:
        with driver.session() as session:
            if graph_data.symbolDependencyEdges:
                for edge in graph_data.symbolDependencyEdges:
                    session.write_transaction(add_symbol_dependency_edge, edge)
        return {"message": "add_symbol_dependency data added successfully"}   
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add_module_dependency")
async def add_module_dependency(graph_data: GraphData):
    try:
        with driver.session() as session:  
            if graph_data.moduleDependencyEdges:
                for edge in graph_data.moduleDependencyEdges:
                    session.write_transaction(add_module_dependency_edge, edge)
        return {"message": "add_module_dependency data added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add_nodes_source_code")
async def add_nodes_source_code(graph_data: GraphData):
    try:
        with driver.session() as session:
            if graph_data.symbolNodes:
                for symbol in graph_data.symbolNodes:
                    session.write_transaction(add_symbol_source_code_node, symbol)
        return {"message": "add_nodes data added successfully"}         
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_module_embeddings", response_model=EmbeddingsResponse)
async def generate_module_embeddings():
    try:
        processed_count = 0
        with driver.session() as session:
            result = session.run(
                "MATCH (m:Module) WHERE m.moduleSourceCode IS NOT NULL RETURN m.modulePath as path, m.moduleSourceCode as code"
            )
            for record in result:
                embeddings = embeddings_model.embed_query(record["code"])
                session.write_transaction(
                    update_module_embeddings,
                    record["path"],
                    embeddings
                )
                processed_count += 1        
        return EmbeddingsResponse(
            message="Module embeddings generated and stored successfully",
            processed_count=processed_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_symbol_embeddings", response_model=EmbeddingsResponse)
async def generate_symbol_embeddings():
    try:
        processed_count = 0
        with driver.session() as session:
            result = session.run(
                """
                MATCH (s:Symbol) 
                WHERE s.symbolCode IS NOT NULL 
                RETURN s.symbolName as name, s.symbolModulePath as path, s.symbolCode as code
                """
            )
            for record in result:
                embeddings = embeddings_model.embed_query(record["code"])
                session.write_transaction(
                    update_symbol_embeddings,
                    record["name"],
                    record["path"],
                    embeddings
                )
                processed_count += 1
        return EmbeddingsResponse(
            message="Symbol embeddings generated and stored successfully",
            processed_count=processed_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/create_vector_indexes")
async def create_vector_indexes():
    try:
        with driver.session() as session:
            symbol_result = session.run(
                """
                CREATE VECTOR INDEX symbolEmbeddings IF NOT EXISTS
                FOR (s:Symbol)
                ON s.symbolCodeEmbeddings
                OPTIONS {indexConfig: {
                `vector.similarity_function`: 'cosine'
                }}
                """
            )
            module_result = session.run(
                """
                CREATE VECTOR INDEX moduleEmdeddings IF NOT EXISTS
                FOR (m:Module)
                ON m.moduleSourceCodeEmbeddings
                OPTIONS {indexConfig: {
                `vector.similarity_function`: 'cosine'
                }}
                """
            )
        return {"message": "Vector Indexes created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/create_fulltext_indexes")
async def create_fulltext_indexes():
    try:
        with driver.session() as session:
            symbol_result = session.run(
                """
                CREATE FULLTEXT INDEX symbolFullText IF NOT EXISTS
                FOR (s:Symbol)
                ON EACH [s.symbolCode]
                """
            )
            module_result = session.run(
                """
                CREATE FULLTEXT INDEX moduleFullText IF NOT EXISTS
                FOR (m:Module)
                ON EACH [m.moduleSourceCode]
                """
            )
        return {"message": "Full Text Indexes created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
   
@app.post("/add_graph")
async def add_graph(graph_data: GraphData):
    try:
        print(type(graph_data))
        print(await add_nodes(graph_data))
        print(await add_exports(graph_data))
        print(await add_module_dependency(graph_data))
        print(await add_symbol_dependency(graph_data))
        print(await add_nodes_source_code(graph_data))
        print(await add_embeddings())
        print(await add_indexes())
        return {"message": "add_graph data added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
   
@app.post("/add_embeddings")
async def add_embeddings():
    try:
        print(await generate_module_embeddings())
        print(await generate_symbol_embeddings())
        return {"message": "add_embeddings data added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/add_indexes")
async def add_indexes():
    try:
        print(await create_vector_indexes())
        print(await create_fulltext_indexes())
        return {"message": "add_indexes data added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_schema")
async def generate_schema(file: UploadFile = File(...)) -> Dict:
    try:
        res = await convert_brd_to_schema(file)
        return res
    except Exception as e:
        return {"error": str(e)}

@app.post("/create_graph_from_zip")
async def create_graph_from_zip(file: UploadFile = File(...)) -> Dict:
    try:
        res = await convert_zip_to_graph(file)
        return res
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/query_schema")
async def query_schema(request: QueryRequest):
    try:
        res = await convert_query_to_schema(request.query)
        return res
    except Exception as e:
        return {"error": str(e)}
          
@app.post("/cypher_query")
async def cypher_query(request: QueryRequest):
    try:
        response = cypher_chain.invoke({"query": request.query})
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
      
@app.post("/nlp")
async def nlp(request: QueryRequest):
    try:
        response = rag.search(query_text=request.query, retriever_config={"top_k": 5})
        print(response.answer)
        return {"result": response.answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/understanding_symbols")
async def understanding_symbols(request: QueryRequest):
    try:
        result = cypher_chain.invoke({"query": request.query})
        full_response = ""
        for record in result["result"].replace(".","").replace(" ","").split(","):
            print(record)
            if record!="":
                query_text = f"I can't understand a bit about {record} file can you please explain me all the symbols associated with utils.py file and explain in detail"
                response = rag.search(query_text=query_text, retriever_config={"top_k": 5})
                full_response += response.answer
                print(full_response)
        return {"result": full_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_graph_data")
async def get_graph_data():
    try:
        with driver.session() as session:
            result = session.run("MATCH p=()-[]->() RETURN p LIMIT 1000")
            
            nodes = set()
            edges = []
            nodes_data = []
            edges_data = []

            for record in result:
                path = record["p"]
                for node in path.nodes:
                    if node.id not in nodes:
                        nodes.add(node.id)
                        node_data = {
                            "id": node.id,
                            "labels": list(node.labels),
                            "properties": filter_properties(dict(node))
                        }
                        nodes_data.append(node_data)
                
                for rel in path.relationships:
                    edge_data = {
                        "id": rel.id,
                        "source": rel.start_node.id,
                        "target": rel.end_node.id,
                        "type": rel.type,
                        "properties": dict(rel)
                    }
                    edges_data.append(edge_data)

            return {"nodes": nodes_data, "edges": edges_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def health_check():
    return {"status": "healthy"}
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000, debug=True)