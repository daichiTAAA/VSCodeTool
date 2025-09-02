# VSCodeTool – Databricks Knowledge Search Suite

本リポジトリは、VS Code の Language Model Tool(API)を用いて Azure Databricks のナレッジベースに安全にアクセスする拡張機能と、企業ガバナンス下で Databricks API を中継する Gateway API（FastAPI）を含む、エンドツーエンドの実装一式です。

- 拡張機能: `databricks-knowledge-search/`（LM Tools／Copilot Agent から使用）
- API ゲートウェイ: `gateway-api/`（httpx による 1対1 マッピングの薄いゲートウェイ。DIでトークン取得を切替）
- 設計/調査/配布ドキュメント: `docs/`

---

## クイックスタート

- サブモジュール取得（必要に応じて）
```bash
git submodule update --init --recursive
```

### 1) Gateway API を Docker Compose で起動
リポジトリ直下の `docker-compose.yaml` を使用します。`.env` は `gateway-api/.env` を読み込みます。

```bash
cp gateway-api/.env.example gateway-api/.env
# 必須: Databricks Workspace URL
echo "DATABRICKS_WORKSPACE_URL=https://adb-xxxxx.azuredatabricks.net" >> gateway-api/.env
# 開発（.env の PAT を使用）
echo "DI_PROVIDER=env" >> gateway-api/.env
# Key Vault を利用する場合は以下も設定
# echo "DI_PROVIDER=keyvault" >> gateway-api/.env
# echo "KEYVAULT_URL=..." >> gateway-api/.env
# echo "SECRET_NAME=..." >> gateway-api/.env

docker compose up --build -d
```

詳細手順やエンドポイント一覧は `gateway-api/README.md` を参照してください。

### 2) VS Code 拡張（LM Tools）をビルド・起動

```bash
cd databricks-knowledge-search
# VS Code でこのフォルダを開く
code .
npm install
npm run watch
# 以下のいずれかの方法で拡張を起動（Extension Development Host）
# databricks-knowledge-search/src/extension.tsを開いた状態で実施する。
# 方法1: F5キー（MacでF5が音声入力になる場合は方法2を使用）
# 方法2: Cmd + Shift + P → "Debug: Start Debugging" を実行
# 方法3: Cmd + Shift + D でデバッグビュー → 緑の再生ボタンをクリック
```

GitHub Copilotの入力欄の右下のConfigure Toolsをクリックし、Extension: Databricks Knowledge Searchが表示されていることを確認する。

拡張の詳細・入力スキーマ・使用例は `databricks-knowledge-search/README.md` を参照してください。VSIX 署名や企業配布は下記ドキュメントを参照してください。

---

## ドキュメント
- 設計書: `docs/02000_設計書/02100_設計書.md`
- 実装概要（対応API/DI/Compose まとめ）: `docs/02000_設計書/02110_実装概要.md`
- 調査（使用想定 Databricks API 一覧）: `docs/09000_調査/09200_ナレッジベース情報取得に使用できそうなDatabricksAPI.md`
- VSIX 署名と企業配布手順: `docs/05000_配布/05100_VSIX署名と企業配布手順.md`

---

## 設定の要点
- Gateway API は環境変数 `DI_PROVIDER=env|keyvault` でトークン取得方式を切替（`.env` は `gateway-api/.env`）。
- VS Code 拡張設定 `databricks-knowledge-search.gatewayUrl` を `http://localhost:8000` に設定して動作確認できます。
