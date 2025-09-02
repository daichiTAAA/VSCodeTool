## Databricks Knowledge Search (VS Code LM Tools)

Azure Databricks のナレッジベースに VS Code からクエリするための Language Model Tool を提供します。GitHub Copilot の Agent モードで自動的にツール選択され、引用可能な検索結果を返します。

### 設定
- `databricks-knowledge-search.gatewayUrl`: Gateway API のベースURL (例: `https://api.company.com/knowledge`)
- `databricks-knowledge-search.timeout`: タイムアウト (ms)
- `databricks-knowledge-search.authToken`: 任意の Bearer トークン (企業の OAuth/SSO を使用する場合は空)

### ツール一覧
- `dbxSql` (`databricks-knowledge-search_sql`): SQL 実行（ハイブリッド/EXTERNAL_LINKS対応）
- `dbxVectorSearch` (`databricks-knowledge-search_vector`): Vector Search のクエリ/ページング/スキャン/リスト
- `dbxServing` (`databricks-knowledge-search_serving`): Serving invoke / list / get / openapi
- `dbxQueries` (`databricks-knowledge-search_queries`): 保存済みクエリの一覧/取得
- `dbxGenie` (`databricks-knowledge-search_genie`): Genie のスペース/会話/メッセージ操作
### 使い方 (Copilot Chat)
```
# SQL 実行
@tools:dbxSql { "statement": "SELECT 'hello' as greeting" }

# Vector 検索
@tools:dbxVectorSearch { "operation": "query", "indexName": "kb_documents_default", "query": "unity catalog", "topK": 5 }

# Serving 呼び出し
@tools:dbxServing { "operation": "invoke", "endpoint": "my-endpoint", "payload": { "input": "hello" } }

# Queries 一覧
@tools:dbxQueries { "operation": "list" }

# Genie: 会話開始
@tools:dbxGenie { "operation": "startConversation", "spaceId": "space-abc", "title": "Sales Trend" }
```

### 開発
```
npm install
npm run watch
F5 で拡張を起動
```
