# LanguageModelToolAPIの使用検討

<br>

# 作成記録
---
* 作成日時 2025/9/1 
* 更新日時

<br>

# 概要
---
VS Code の Language Model Tool API（以下“LM Tools”）を使って、Azure Databricks のナレッジベースを GitHub Copilot の Agent モードで安全に使う方法に関して記載します。

# 対象読者
---
- VS Code + GitHub Copilot を使用する開発者
- Azure Databricks のナレッジベースを活用したい開発チーム
- 社内ナレッジとAIコーディングエージェントの連携を検討している技術者
- VS Code拡張開発・Language Model Tool API に関心のあるエンジニア
- 企業におけるCopilot運用・セキュリティ管理を担当する管理者

<br>

# 目的
---
VS Code の Language Model Tool API を活用して、以下を実現するための技術検討・構想を整理する：

1. **IDE内完結型のナレッジ検索**：VS Code 内で GitHub Copilot Agent モードから直接、社内ナレッジベース（Azure Databricks）を検索・参照可能にする
2. **セキュアな検索専用アクセス**：データの生成・更新は行わず、検索・参照のみに限定したセキュアな仕組みの構築
3. **企業ガバナンス対応**：組織ポリシーによる集中管理・監査・アクセス制御が可能な運用体制の確立
4. **引用付き回答生成**：検索結果を基にした Copilot による引用元明記の回答生成
5. **実装コストの最小化**：既存インフラ（Databricks, Azure）を活用した効率的な実装アプローチの検討

# 内容
---

# 構想：LM Tools × Gateway（検索専用）× Databricks

## 1) ねらい

- **IDE内（VS Code）で完結**し、Copilot **Agentモード**から社内ナレッジ（Databricks）を**検索専用**で呼び出し、**引用付き**で回答に反映。
    
- 生成（要約・整形）は Copilot 側（定額）。ツールは**検索と前処理のみ**。
    
- ツールは **VS Code 拡張として配布**し、**企業ポリシーで利用可否を集中管理**。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    

## 2) 全体フロー（最小）

```
Copilot Agent mode（VS Code）
  → #dbxSearch などの LM Tool を自動/明示呼出し
      → Gateway(API) 認証・監査・レート制御
          → Databricks SQL Warehouse（Statement Execution API 2.0）
      ← {title, snippet, source_url, ...}
  ← Copilot が回答に引用を挿入（整形は Copilot 側）
```

- Agentモードは **内蔵ツール／MCPツール／拡張が提供するツール**を使える（ツールピッカーで有効化、`#ツール名`参照可）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    
- LM Tools ガイドでも「**Agentモードが自動でツールを起動**」と明記。([Visual Studio Code](https://code.visualstudio.com/api/extension-guides/ai/tools "Language Model Tool API | Visual Studio Code Extension
    API"))
    

## 3) コンポーネント仕様（最小）

### A. VS Code 拡張（LM Tools）

- `contributes.languageModelTools` に **dbx_search** を定義：  
    `toolReferenceName: "dbxSearch"`, `canBeReferencedInPrompt: true`（`#dbxSearch` で明示呼出し可能。Agentモード自動起動の対象）。([Visual Studio Code](https://code.visualstudio.com/api/extension-guides/ai/tools "Language Model Tool API | Visual Studio Code Extension
    API"))
    
- 実装は `vscode.lm.registerTool()` で登録し、`invoke()` 内で **Gateway `/search`** を呼ぶ（Bearer）。([Visual Studio Code](https://code.visualstudio.com/api/extension-guides/ai/tools "Language Model Tool API | Visual Studio Code Extension
    API"))
    
- ツール実行時は **確認ダイアログ**（拡張ツールは既定で確認が出る。自動承認も管理可）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    

### B. Gateway（社内 API／検索専用）

- `GET /search?q=...&top_k=5` → Databricks **Statement Execution API 2.0** を **パラメタ化**で実行し、`{title, snippet, source_url, rowid...}` を返す。([Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/sql-execution-tutorial?utm_source=chatgpt.com "Statement Execution API: Run SQL on warehouses - Azure ..."), [docs.databricks.com](https://docs.databricks.com/api/workspace/statementexecution?utm_source=chatgpt.com "Statement Execution API | REST API reference"))
    
- 認証：OAuth2（SPの client_credentials → Bearer）。ログ：`who/when/q_hash/rowcount/latency`。
    
- ネットワーク：WAF / IP Allowlist。**単一出口**に集約。
    

### C. Databricks（Azure）

- **SQL Warehouse** を用意、**サービスプリンシパル OAuth（M2M）**でトークン取得し REST 実行。([Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/auth/oauth-m2m?utm_source=chatgpt.com "Authorize service principal access to Azure Databricks with ..."))
    
- 権限：Warehouse に **CAN USE**、対象ビューに **SELECT**（Unity Catalogに準拠）。([docs.databricks.com](https://docs.databricks.com/aws/en/compute/sql-warehouse/?utm_source=chatgpt.com "Connect to a SQL warehouse | Databricks on AWS"))
    
- API：**Statement Execution**（INLINE + JSON で即時取得、必要ならポーリング）。([Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/sql-execution-tutorial?utm_source=chatgpt.com "Statement Execution API: Run SQL on warehouses - Azure ..."))
    

---

# セキュリティ & 運用

## ポリシーと集中管理

- **Agentモード有効化**：`chat.agent.enabled`（v1.99+）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    
- **第三者拡張ツールの可否**：`chat.extensionTools.enabled` を**組織管理**で制御（MDM/ポリシー）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    
- **拡張の許可リスト**：`extensions.allowed` で**許可した拡張のみ**端末にインストール可（v1.96+）。([Visual Studio Code](https://code.visualstudio.com/docs/setup/enterprise?utm_source=chatgpt.com "Enterprise support"))
    
- ツールは**確認ダイアログ**で逐次承認（または限定的な自動承認）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    

## Gateway 境界防御

- **最小権限**（Warehouse CAN USE＋対象ビュー SELECT）、**WAF＋IP 制限**、**レート制御**。
    
- **PII/秘匿語マスキング**、**監査ログ**（個人情報はハッシュ）。
    
- **キャッシュ**で同一クエリの短期再実行を抑制。
    

---

# 実装ステップ（最短）

1. **Databricks**
    
    - 検索ビュー例：`main.knowledge.kb_docs(title, snippet, source_url, text, id)`
        
    - SP を workspace に割当→ OAuth 秘密生成 → Warehouse 権限付与。([Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/auth/oauth-m2m?utm_source=chatgpt.com "Authorize service principal access to Azure Databricks with ..."), [docs.databricks.com](https://docs.databricks.com/aws/en/compute/sql-warehouse/?utm_source=chatgpt.com "Connect to a SQL warehouse | Databricks on AWS"))
        
2. **Gateway**
    
    - `/search` 実装 → Statement Execution（`:q`, `:row_limit` の**パラメタ化**）→ JSON返却。([Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/sql-execution-tutorial?utm_source=chatgpt.com "Statement Execution API: Run SQL on warehouses - Azure ..."))
        
3. **VS Code 拡張（LM Tools）**
    
    - `languageModelTools` で **dbx_search** 定義（`toolReferenceName:"dbxSearch"`）。
        
    - `registerTool` / `invoke()` で Gateway を呼ぶ。**Marketplace/VSIX** で配布。([Visual Studio Code](https://code.visualstudio.com/api/extension-guides/ai/tools "Language Model Tool API | Visual Studio Code Extension
        API"))
        
4. **組織設定**
    
    - `chat.agent.enabled` ON、`chat.extensionTools.enabled` を ON（必要なチームのみ）。**拡張許可リスト**運用。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
        

---

# 使い方（エンドユーザー）

- Agentモードを選択 → そのまま課題を投げる（Agent が自動で `#dbxSearch` を使う）
    
- あるいは明示的に **`#dbxSearch "SLA の定義"`** のように叩く（Ask/編集/Agent いずれでも `#` 参照可）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    

---

# 比較：LM Tools vs Copilot Extensions vs MCP

| 観点             | **LM Tools（VS Code拡張）**                                                                                                                                                                                                         | **GitHub Copilot Extensions**                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | **MCP（Model Context Protocol）**                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 主体/配布        | VS Code拡張（Marketplace/VSIX）                                                                                                                                                                                                     | GitHub App ベースで Copilot Chat に統合                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | MCPサーバーを用意し VS Code ほか対応クライアントから利用                                                                                                                                    |
| Agentモード対応  | **対応**：拡張ツールは Agent で自動/明示呼出し可。`#ツール名`も全モードで可。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))                                    | **未統合（現状）**：公式Docsは Chat連携を説明。Agent対応は明記なし／コミュニティで「現時点は不可」との回答例。([GitHub Docs](https://docs.github.com/copilot/how-tos/context/install-copilot-extensions/using-extensions-to-integrate-external-tools-with-copilot-chat?utm_source=chatgpt.com "Using extensions to integrate external tools with Copilot Chat"), [GitHub](https://github.com/orgs/community/discussions/157927?utm_source=chatgpt.com "GitHub Copilot Extension with VS Code Agent mode")) | **対応**：Agent は MCP ツールを使える。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))                                  |
| IDE範囲          | **VS Code限定**                                                                                                                                                                                                                     | Copilot Chat 対応クライアント（ただし Agent 連携は現状なし）([GitHub Docs](https://docs.github.com/copilot/how-tos/context/install-copilot-extensions/using-extensions-to-integrate-external-tools-with-copilot-chat?utm_source=chatgpt.com "Using extensions to integrate external tools with Copilot Chat"))                                                                                                                                                                                             | VS Code ほか MCP対応クライアント                                                                                                                                                            |
| 企業ガバナンス   | 拡張許可リスト (`extensions.allowed`)、第三者拡張ツール可否 (`chat.extensionTools.enabled`) を**中央管理**。([Visual Studio Code](https://code.visualstudio.com/docs/setup/enterprise?utm_source=chatgpt.com "Enterprise support")) | Enterprise/Org 管理者が拡張の配布・可視性を制御（Copilot 側）([GitHub Docs](https://docs.github.com/copilot/how-tos/context/install-copilot-extensions/using-extensions-to-integrate-external-tools-with-copilot-chat?utm_source=chatgpt.com "Using extensions to integrate external tools with Copilot Chat"))                                                                                                                                                                                            | ツール発見/使用を `chat.mcp.discovery.enabled`等で管理（VS Code 側）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))   |
| 実装コスト       | **VS Code拡張を1本**＋Gateway                                                                                                                                                                                                       | **GitHub App＋拡張**＋Gateway                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | **MCPサーバー**＋（必要なら）Gateway                                                                                                                                                        |
| セキュリティ境界 | 端末→Gateway の**単一出口**／実行前承認ダイアログ。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))                                                              | GitHub 側で拡張許可を集中管理（Askモード前提）([GitHub Docs](https://docs.github.com/copilot/how-tos/context/install-copilot-extensions/using-extensions-to-integrate-external-tools-with-copilot-chat?utm_source=chatgpt.com "Using extensions to integrate external tools with Copilot Chat"))                                                                                                                                                                                                           | MCPサーバーの公開/発見をどう運用するかが鍵                                                                                                                                                  |
| 将来性           | VS Code 公式が **AI拡張API（LM/Tools/Shell）を継続拡充**と明言。1.99で Agent×拡張ツール対応を強化。([Visual Studio Code](https://code.visualstudio.com/docs/supporting/FAQ?utm_source=chatgpt.com "Visual Studio Code FAQ"))        | Chat拡張としては安定。**Agent統合は未記載**（将来は要ウォッチ）。([GitHub Docs](https://docs.github.com/copilot/how-tos/context/install-copilot-extensions/using-extensions-to-integrate-external-tools-with-copilot-chat?utm_source=chatgpt.com "Using extensions to integrate external tools with Copilot Chat"))                                                                                                                                                                                        | 標準化路線でマルチクライアント展望あり。VS Code側も MCP を正式サポート。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code")) |

---

# 将来性（LM Tools の見通し）

- **Agentモードの正式対応**：1.99 で「拡張が提供する LM ツールを Agent で使える」ことが公式に言及（更新情報/ブログ）。([Visual Studio Code](https://code.visualstudio.com/updates/v1_99?utm_source=chatgpt.com "March 2025 (version 1.99)"))
    
- **VS Code としての投資継続**：FAQ で「**Language Model API／Tools API／Shell Execution API** など AI 拡張 API を継続追加」と明記。([Visual Studio Code](https://code.visualstudio.com/docs/supporting/FAQ?utm_source=chatgpt.com "Visual Studio Code FAQ"))
    
- **選び方ガイド**に「**Agentモードの自動呼出しをしたいなら LM Tools を選ぶ**」と明記（MCP/LM Toolsの使い分け）。([Visual Studio Code](https://code.visualstudio.com/api/extension-guides/ai/ai-extensibility-overview?utm_source=chatgpt.com "AI extensibility in VS Code"))
    

> 以上より、**Agentモードで VS Code に深く統合しつつ配布・統制しやすい**手段として、LM Tools は“公式一軍”のポジションです。

---

# リスクと対策

- **企業ポリシーで拡張ツール無効化され得る**  
    → `chat.extensionTools.enabled` を**組織で ON**、許可拡張を `extensions.allowed` に登録。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    
- **ツールの自動承認の乱用**  
    → 既定は確認ダイアログ。高権限動作（例：ファイル変更・端末コマンド）は「Ask First」を推奨。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    
- **データ持ち出し**  
    → Gateway で**マスキング／監査／IP制限**。Databricks 側は**最小権限**＋ビューで秘匿列除外。([docs.databricks.com](https://docs.databricks.com/aws/en/compute/sql-warehouse/?utm_source=chatgpt.com "Connect to a SQL warehouse | Databricks on AWS"))
    

---

# まとめ（推奨プラン）

1. **短期**：LM Tools で `#dbxSearch` ツールを実装（Agentモード運用）。
    
2. **中期**：同じ Gateway を **Copilot Extensions（Askモード）**からも呼べるように（IDE横断のため）。([GitHub Docs](https://docs.github.com/copilot/how-tos/context/install-copilot-extensions/using-extensions-to-integrate-external-tools-with-copilot-chat?utm_source=chatgpt.com "Using extensions to integrate external tools with Copilot Chat"))
    
3. **将来**：必要に応じて **MCP サーバー面**を追加し、VS Code 以外の MCP 対応クライアントにも展開（I/Oは共通）。([Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode "Use agent mode in VS Code"))
    

> この三層（LM Tools／Extensions／MCP）を**同じ Gateway**にぶら下げる設計なら、**いま即価値**＋**将来の選択肢**の両立が可能です。

---

# 参考
* [Visual Studio Code公式サイト Create a language model tool](https://code.visualstudio.com/api/extension-guides/ai/tools#create-a-language-model-tool)
* [Microsoft公式GitHubサンプルコード](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)