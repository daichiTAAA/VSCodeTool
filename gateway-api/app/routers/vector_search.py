from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..deps.dbx import get_databricks_client
from ..services.databricks_client import DatabricksClient

router = APIRouter()


class VectorQuery(BaseModel):
    indexName: str
    query: str
    topK: int | None = 5


@router.post("/indexes/query")
async def query_index(req: VectorQuery, client: DatabricksClient = Depends(get_databricks_client)):
    body = req.model_dump()
    return await client.request_json('POST', '/api/2.0/vector-search/indexes/query', json=body)


@router.get('/endpoints')
async def list_vector_endpoints(client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', '/api/2.0/vector-search/endpoints')


@router.get('/endpoints/{name}')
async def get_vector_endpoint(name: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/vector-search/endpoints/{name}')


@router.get('/indexes')
async def list_indexes(client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', '/api/2.0/vector-search/indexes')


@router.get('/indexes/{index_name}')
async def get_index(index_name: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/vector-search/indexes/{index_name}')


class NextPageRequest(BaseModel):
    indexName: str
    query: str | None = None
    next_page_token: str


@router.post('/indexes/query/next-page')
async def query_next_page(req: NextPageRequest, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('POST', '/api/2.0/vector-search/indexes/query/next-page', json=req.model_dump())


class ScanRequest(BaseModel):
    indexName: str
    num_results: int | None = None
    primary_key: str | None = None


@router.post('/indexes/scan')
async def scan_index(req: ScanRequest, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('POST', '/api/2.0/vector-search/indexes/scan', json=req.model_dump())
