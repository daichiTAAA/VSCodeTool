import os
from abc import ABC, abstractmethod
from functools import lru_cache
from typing import Optional


class TokenProvider(ABC):
    @abstractmethod
    async def get_token(self) -> str:
        ...


class EnvTokenProvider(TokenProvider):
    def __init__(self, env_key: str = "DATABRICKS_PAT") -> None:
        self.env_key = env_key

    async def get_token(self) -> str:
        token = os.getenv(self.env_key)
        if not token:
            raise RuntimeError(
                f"Environment variable '{self.env_key}' is not set. "
                "Set it in .env or container environment for development."
            )
        return token


class KeyVaultTokenProvider(TokenProvider):
    def __init__(self, vault_url: str, secret_name: str) -> None:
        self.vault_url = vault_url
        self.secret_name = secret_name
        self._cached: Optional[str] = None

    async def get_token(self) -> str:
        if self._cached:
            return self._cached
        # Import on demand so env-only dev doesn't need azure packages installed
        from azure.identity import DefaultAzureCredential  # type: ignore
        from azure.keyvault.secrets import SecretClient  # type: ignore

        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=self.vault_url, credential=credential)
        secret = client.get_secret(self.secret_name)
        if not secret or not secret.value:
            raise RuntimeError(
                f"Secret '{self.secret_name}' not found or empty in Key Vault"
            )
        self._cached = secret.value
        return self._cached


@lru_cache
def get_provider(di_mode: str | None = None) -> TokenProvider:
    mode = (di_mode or os.getenv("DI_PROVIDER") or "env").lower()
    if mode == "env":
        return EnvTokenProvider(os.getenv("DATABRICKS_PAT_ENV_KEY", "DATABRICKS_PAT"))
    if mode == "keyvault":
        vault_url = os.getenv("KEYVAULT_URL") or os.getenv("AZURE_KEYVAULT_URL")
        secret_name = os.getenv("SECRET_NAME") or os.getenv(
            "DATABRICKS_TOKEN_SECRET_NAME"
        )
        if not vault_url or not secret_name:
            raise RuntimeError(
                "KEYVAULT_URL and SECRET_NAME must be set when DI_PROVIDER=keyvault"
            )
        return KeyVaultTokenProvider(vault_url, secret_name)
    raise RuntimeError(
        f"Unknown DI_PROVIDER '{mode}'. Use 'env' or 'keyvault'."
    )

