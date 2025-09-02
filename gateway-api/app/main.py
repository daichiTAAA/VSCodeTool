from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import sql_statements, queries, vector_search, serving_endpoints, genie
from .middleware.auth import auth_middleware


def create_app() -> FastAPI:
    app = FastAPI(title="Databricks Gateway API", version="0.1.0")

    # CORS (adjust for corp env)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.middleware('http')(auth_middleware)

    app.include_router(sql_statements.router, prefix="/api/2.0/sql")
    app.include_router(queries.router, prefix="/api/2.0/sql")
    app.include_router(vector_search.router, prefix="/api/2.0/vector-search")
    app.include_router(serving_endpoints.router, prefix="/api/2.0")
    app.include_router(genie.router, prefix="/api/2.0/genie")

    @app.get("/healthz")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

