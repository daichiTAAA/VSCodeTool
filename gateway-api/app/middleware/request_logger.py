import os
import time
import json
from typing import Any, Dict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from ..utils.logger import get_logger


def _mask(s: str) -> str:
    if not s:
        return s
    if len(s) <= 8:
        return "***"
    return s[:4] + "***" + s[-4:]


def _sanitize_headers(headers: Dict[str, str]) -> Dict[str, str]:
    out: Dict[str, str] = {}
    for k, v in headers.items():
        kl = k.lower()
        if kl in {"authorization", "cookie", "x-api-key"}:
            out[k] = _mask(v)
        else:
            out[k] = v
    return out


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.logger = get_logger("gateway.request")
        self.mode = os.getenv("REQUEST_LOGGING", "basic").lower()  # basic|body|off
        try:
            self.max_body = int(os.getenv("MAX_BODY_LOG", "4096"))
        except Exception:
            self.max_body = 4096

    async def dispatch(self, request: Request, call_next):
        if self.mode == "off":
            return await call_next(request)

        started = time.time()
        client = request.client
        client_ip = f"{client.host}:{client.port}" if client else "-"
        path = request.url.path
        query = request.url.query
        method = request.method
        headers = {k: v for k, v in request.headers.items() if k.lower() in (
            "host", "user-agent", "content-type", "content-length", "x-forwarded-for", "x-request-id", "authorization"
        )}
        s_headers = _sanitize_headers(headers)

        body_excerpt: str | None = None
        if self.mode == "body":
            try:
                raw = await request.body()
                if raw:
                    ct = request.headers.get("content-type", "")
                    if "application/json" in ct:
                        try:
                            body_excerpt = json.dumps(json.loads(raw), ensure_ascii=False)[: self.max_body]
                        except Exception:
                            body_excerpt = raw.decode(errors="ignore")[: self.max_body]
                    elif ct.startswith("text/") or "x-www-form-urlencoded" in ct:
                        body_excerpt = raw.decode(errors="ignore")[: self.max_body]
                    else:
                        body_excerpt = f"<{len(raw)} bytes not logged>"
            except Exception as e:
                self.logger.warning("Failed to read request body for logging: %s", e)

        self.logger.info(
            "REQ %s %s?%s from %s headers=%s%s",
            method,
            path,
            query,
            client_ip,
            s_headers,
            f" body={body_excerpt}" if body_excerpt is not None else "",
        )

        resp: Response = await call_next(request)
        dur_ms = int((time.time() - started) * 1000)
        self.logger.info("RES %s %s -> %s (%d ms)", method, path, resp.status_code, dur_ms)
        return resp

