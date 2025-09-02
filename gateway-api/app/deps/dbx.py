from fastapi import Depends

from ..deps.token import get_databricks_token
from ..services.databricks_client import DatabricksClient, get_workspace_url


def get_databricks_client(token: str = Depends(get_databricks_token)) -> DatabricksClient:
    ws = get_workspace_url()
    return DatabricksClient(ws, token)

