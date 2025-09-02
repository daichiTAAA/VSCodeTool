## Databricks Knowledge Search (VS Code LM Tools)

Azure Databricks のナレッジベースに VS Code からクエリするための Language Model Tool を提供します。GitHub Copilot の Agent モードで自動的にツール選択され、引用可能な検索結果を返します。

### 設定
- `databricks-knowledge-search.gatewayUrl`: Gateway API のベースURL (例: `https://api.company.com/knowledge`)
- `databricks-knowledge-search.timeout`: タイムアウト (ms)
- `databricks-knowledge-search.authToken`: 任意の Bearer トークン (企業の OAuth/SSO を使用する場合は空)

### ツール: `dbxSearch`
Input Schema:
```
{
  mode: 'sql' | 'query' | 'vector' | 'serving' | 'genie',
  operation?: string, // modeに応じた操作（serving: invoke|list|get|openapi など）
  query?: string,
  resourceId?: string,
  conversationId?: string,
  messageId?: string,
  attachmentId?: string,
  payload?: object,
  nextPageToken?: string,
  topK?: number,
  format?: 'markdown' | 'json'
}
```

### 使い方 (Copilot Chat)
```
# Vector 検索
@tools:dbxSearch { "mode": "vector", "query": "lakehouse セキュリティ", "resourceId": "kb_documents_default", "topK": 5 }

# Vector 一覧
@tools:dbxSearch { "mode": "vector", "operation": "listIndexes" }

# SQL 実行
@tools:dbxSearch { "mode": "sql", "query": "SELECT 'hello' as greeting" }

# Serving 呼び出し
@tools:dbxSearch { "mode": "serving", "operation": "invoke", "resourceId": "my-endpoint", "payload": { "input": "hello" } }

# Genie 会話作成
@tools:dbxSearch { "mode": "genie", "operation": "startConversation", "resourceId": "space-abc", "query": "Title" }
```

### 開発
```
npm install
npm run watch
F5 で拡張を起動
```
