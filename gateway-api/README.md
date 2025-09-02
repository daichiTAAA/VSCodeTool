## Databricks Gateway API (FastAPI)

設計書の Gateway API を FastAPI で実装するためのスケルトンです。Databricks 実接続は未実装ですが、トークン取得は DI Container で切り替え可能です。

### DI コンテナ切替（トークン取得）
- `EnvTokenProvider`（開発用）: `.env` の `DATABRICKS_PAT` を使用
- `KeyVaultTokenProvider`（本番想定）: `KEYVAULT_URL` と `SECRET_NAME` をもとに Key Vault から PAT を取得（Managed Identity を想定）

切替は `DI_PROVIDER=env | keyvault` で行います。

### Docker Compose で起動
```
# 初回: .env を作成
cp gateway-api/.env.example gateway-api/.env
# 開発（.env の PAT を使用）
echo "DI_PROVIDER=env" >> gateway-api/.env
# Databricks ワークスペース URL を設定（例）
echo "DATABRICKS_WORKSPACE_URL=https://adb-xxxxx.azuredatabricks.net" >> gateway-api/.env
docker compose up --build -d

# Key Vault を使用する場合（ホスト環境に MI/azure login が必要）
echo "DI_PROVIDER=keyvault" >> gateway-api/.env
echo "KEYVAULT_URL=..." >> gateway-api/.env
echo "SECRET_NAME=..." >> gateway-api/.env
echo "DATABRICKS_WORKSPACE_URL=https://adb-xxxxx.azuredatabricks.net" >> gateway-api/.env
docker compose up --build -d
```

### リクエストログ（Invalid HTTP 対応の補助）
- アプリ層のアクセスログ: `REQUEST_LOGGING=basic|body|off`（既定: basic）
  - `basic`: メソッド/パス/クエリ/主要ヘッダ（Authorization 等はマスク）
  - `body`: 本文を最大 `MAX_BODY_LOG` バイトまでログ（PII に注意）
- 例（`.env` へ）:
```
echo "REQUEST_LOGGING=body" >> gateway-api/.env
echo "MAX_BODY_LOG=2048" >> gateway-api/.env
```
- Uvicorn のパーサ段階で起きる `WARNING: Invalid HTTP request received.` はアプリ層に到達しないため本文は取得できません。詳細を得るにはサーバーログを詳細化してください:
```
echo "UVICORN_CMD_ARGS=--access-log --log-level debug" >> gateway-api/.env
docker compose up -d
```

### エンドポイント (抜粋)
- Databricks SQL: `POST/GET/POST/GET /sql/statements...`, `GET /sql/queries`, `GET /sql/queries/{id}`
- Vector Search: `GET /vector-search/endpoints`, `GET /vector-search/endpoints/{name}`, `GET /vector-search/indexes`, `GET /vector-search/indexes/{name}`, `POST /vector-search/indexes/query`, `POST /vector-search/indexes/query/next-page`, `POST /vector-search/indexes/scan`
- Serving: `GET /serving-endpoints`, `GET /serving-endpoints/{name}`, `GET /serving-endpoints/{name}/openapi`, `POST /serving-endpoints/{name}/invocations`
- Genie: `GET /genie/spaces`, `GET /genie/spaces/{spaceId}`, `GET /genie/spaces/{spaceId}/conversations`, `POST /genie/spaces/{spaceId}/conversations/{conversationId}/messages`, `GET /genie/spaces/{spaceId}/conversations/{conversationId}/messages/{messageId}`, `POST /genie/spaces/{spaceId}/conversations/{conversationId}/messages/{messageId}/attachments/{attachmentId}/execute-query`, `GET /genie/spaces/{spaceId}/conversations/{conversationId}/messages/{messageId}/attachments/{attachmentId}/query-result`, `POST /genie/spaces/{spaceId}/start-conversation`

### 今後の実装ポイント
- OAuth2/JWT 検証、Managed Identity → Databricks アクセストークン取得
- Databricks API へのリバースプロキシ実装 (httpx)
- レート制限、監査ログ、PII マスキング

### 開発メモ
- 依存解決: `pip install -r requirements.txt`
- ローカル起動: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- DI 実体: `app/di/providers.py`、FastAPI 依存: `app/deps/token.py`
- Databricks クライアント: `app/services/databricks_client.py`（httpx 逆プロキシ）。
- EXTERNAL_LINKS 取得: `POST /api/2.0/sql/statements/external-links/fetch`（SAS へ Authorization 無しで取得）。
