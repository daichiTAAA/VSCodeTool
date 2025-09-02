from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..deps.dbx import get_databricks_client
from ..services.databricks_client import DatabricksClient

router = APIRouter()


class SqlRequest(BaseModel):
    statement: str | None = None
    # For Databricks SQL API, v2.0 expects { statement, wait_timeout, on_wait_timeout, ... }
    # Keep open structure for forward-compat
    # Accept legacy field 'sql' from our earlier stub
    sql: str | None = None
    wait_timeout: str | None = None
    on_wait_timeout: str | None = None
    catalog: str | None = None
    schema: str | None = None
    parameters: dict | None = None


@router.post("/statements")
async def post_statement(req: SqlRequest, client: DatabricksClient = Depends(get_databricks_client)):
    body = req.model_dump(exclude_none=True)
    # Back-compat: if 'sql' is provided map to 'statement'
    if 'sql' in body and 'statement' not in body:
        body['statement'] = body.pop('sql')
    # Hybrid mode defaults
    body.setdefault('wait_timeout', '10s')
    body.setdefault('on_wait_timeout', 'CONTINUE')

    return await client.request_json('POST', '/api/2.0/sql/statements', json=body)


@router.get("/statements/{statement_id}")
async def get_statement(statement_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/sql/statements/{statement_id}')


@router.post("/statements/{statement_id}/cancel")
async def cancel_statement(statement_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('POST', f'/api/2.0/sql/statements/{statement_id}/cancel')


@router.get("/statements/{statement_id}/result/chunks/{chunk_index}")
async def get_chunk(statement_id: str, chunk_index: int, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/sql/statements/{statement_id}/result/chunks/{chunk_index}')


class ExternalLinkRequest(BaseModel):
    url: str


@router.post('/statements/external-links/fetch')
async def fetch_external(req: ExternalLinkRequest, client: DatabricksClient = Depends(get_databricks_client)):
    # Security: only allow https and Azure Storage hosts
    from urllib.parse import urlparse

    u = urlparse(req.url)
    if u.scheme != 'https' or not u.netloc:
        raise HTTPException(status_code=400, detail='Only https URLs are allowed')
    allowed = (
        u.netloc.endswith('.blob.core.windows.net')
        or u.netloc.endswith('.dfs.core.windows.net')
        or u.netloc.endswith('.table.core.windows.net')
    )
    if not allowed:
        raise HTTPException(status_code=400, detail='URL host not allowed for external fetch')

    resp = await client.fetch_external(req.url)
    # Stream response content back as text
    content_type = resp.headers.get('content-type', 'application/octet-stream')
    return {
        'status_code': resp.status_code,
        'content_type': content_type,
        'text': resp.text if 'text' in content_type or 'json' in content_type else None,
        'content_length': int(resp.headers.get('content-length', '0') or 0),
    }
