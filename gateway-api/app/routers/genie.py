from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..deps.dbx import get_databricks_client
from ..services.databricks_client import DatabricksClient

router = APIRouter()


class CreateMessageRequest(BaseModel):
    body: str | None = None
    attachments: list[dict] | None = None


@router.get('/spaces')
async def list_spaces(client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', '/api/2.0/genie/spaces')


@router.get('/spaces/{space_id}')
async def get_space(space_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/genie/spaces/{space_id}')


@router.get('/spaces/{space_id}/conversations')
async def list_conversations(space_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/genie/spaces/{space_id}/conversations')


@router.post('/spaces/{space_id}/conversations/{conversation_id}/messages')
async def create_message(space_id: str, conversation_id: str, req: CreateMessageRequest, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('POST', f'/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages', json=req.model_dump(exclude_none=True))


@router.get('/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}')
async def get_message(space_id: str, conversation_id: str, message_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}')


@router.post('/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}/attachments/{attachment_id}/execute-query')
async def execute_message_attachment_query(space_id: str, conversation_id: str, message_id: str, attachment_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('POST', f'/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}/attachments/{attachment_id}/execute-query')


@router.get('/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}/attachments/{attachment_id}/query-result')
async def get_message_attachment_query_result(space_id: str, conversation_id: str, message_id: str, attachment_id: str, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('GET', f'/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}/attachments/{attachment_id}/query-result')


class StartConversationRequest(BaseModel):
    title: str | None = None


@router.post('/spaces/{space_id}/start-conversation')
async def start_conversation(space_id: str, req: StartConversationRequest, client: DatabricksClient = Depends(get_databricks_client)):
    return await client.request_json('POST', f'/api/2.0/genie/spaces/{space_id}/start-conversation', json=req.model_dump(exclude_none=True))
