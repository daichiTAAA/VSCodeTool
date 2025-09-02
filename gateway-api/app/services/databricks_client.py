import os
from typing import Any, Dict, Optional

import httpx
from fastapi import HTTPException


class DatabricksClient:
    def __init__(self, workspace_url: str, token: str, timeout: float = 30.0):
        self.workspace_url = workspace_url.rstrip('/')
        self.token = token
        self.timeout = timeout

    def _headers(self) -> Dict[str, str]:
        return {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json',
        }

    async def request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Any] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> httpx.Response:
        url = f"{self.workspace_url}{path}"
        merged = {**self._headers(), **(headers or {})}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                resp = await client.request(method, url, params=params, json=json, headers=merged)
                return resp
            except httpx.HTTPError as e:
                raise HTTPException(status_code=502, detail=f"Databricks upstream error: {e}")

    async def request_json(self, method: str, path: str, **kwargs) -> Any:
        resp = await self.request(method, path, **kwargs)
        if resp.status_code >= 400:
            # Bubble up Databricks error body
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            raise HTTPException(status_code=resp.status_code, detail=detail)
        try:
            return resp.json()
        except Exception:
            raise HTTPException(status_code=502, detail="Invalid JSON from Databricks")

    async def fetch_external(self, url: str) -> httpx.Response:
        # No Authorization header must be sent to SAS URLs
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                resp = await client.get(url, headers={})
                return resp
            except httpx.HTTPError as e:
                raise HTTPException(status_code=502, detail=f"External link fetch error: {e}")


def get_workspace_url() -> str:
    ws = os.getenv('DATABRICKS_WORKSPACE_URL')
    if not ws:
        # Optional fallback for settings.yaml was removed for simplicity
        raise RuntimeError('DATABRICKS_WORKSPACE_URL is not set')
    return ws

