from fastapi import APIRouter, Depends
from ..deps.dbx import get_databricks_client
from ..services.databricks_client import DatabricksClient

router = APIRouter()


@router.get("/queries/{query_id}")
async def get_query(query_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/sql/queries/{query_id}')


@router.get('/queries')
async def list_queries(client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', '/api/2.0/sql/queries')
