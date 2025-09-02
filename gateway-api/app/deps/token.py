from functools import lru_cache
from typing import Annotated

from fastapi import Depends
from dotenv import load_dotenv

from ..di.providers import TokenProvider, get_provider


@lru_cache
def _loaded() -> bool:
    # Load .env for development convenience (no-op if file missing)
    load_dotenv(override=False)
    return True


def get_token_provider(_: bool = Depends(_loaded)) -> TokenProvider:  # type: ignore
    return get_provider()


async def get_databricks_token(provider: Annotated[TokenProvider, Depends(get_token_provider)]) -> str:
    return await provider.get_token()

