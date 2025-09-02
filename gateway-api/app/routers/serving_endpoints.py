from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..deps.dbx import get_databricks_client
from ..services.databricks_client import DatabricksClient

router = APIRouter()


class InvokeRequest(BaseModel):
    input: dict | list | str | None = None


@router.post("/serving-endpoints/{endpoint}/invocations")
async def invoke(endpoint: str, body: InvokeRequest, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('POST', f'/api/2.0/serving-endpoints/{endpoint}/invocations', json=body.model_dump())


@router.get('/serving-endpoints')
async def list_endpoints(client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', '/api/2.0/serving-endpoints')


@router.get('/serving-endpoints/{name}')
async def get_endpoint(name: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/serving-endpoints/{name}')


@router.get('/serving-endpoints/{name}/openapi')
async def get_endpoint_schema(name: str, client: DatabricksClient = Depends(get_databricks_client)):
    resp = await client.request('GET', f'/api/2.0/serving-endpoints/{name}/openapi')
    return resp.json()
