from fastapi import Request, Response


async def auth_middleware(request: Request, call_next):
    # NOTE: Stub auth that just checks header presence when provided
    authz = request.headers.get('authorization') or request.headers.get('Authorization')
    # In real impl, verify JWT or exchange Managed Identity for Databricks token
    response: Response = await call_next(request)
    return response

