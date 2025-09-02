import * as vscode from 'vscode';
import { GatewayClient } from '../services/gatewayClient';
import { Logger } from '../utils/logger';

type Mode = 'sql' | 'query' | 'vector' | 'serving' | 'genie';

export interface DbxSearchParameters {
  mode: Mode;
  query?: string;
  resourceId?: string;
  operation?: string;
  conversationId?: string;
  messageId?: string;
  attachmentId?: string;
  payload?: unknown;
  nextPageToken?: string;
  topK?: number;
  format?: 'markdown' | 'json';
}

export class DbxSearchTool implements vscode.LanguageModelTool<DbxSearchParameters> {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<DbxSearchParameters>
  ) {
    const p = options.input;
    const md = new vscode.MarkdownString();
    md.appendMarkdown(`以下の操作を Gateway API 経由で実行します。`);
    md.appendMarkdown(`\n\n- モード: \`${p.mode}\``);
    if (p.query) md.appendMarkdown(`\n- クエリ/質問: \`${this.trunc(p.query)}\``);
    if (p.resourceId) md.appendMarkdown(`\n- リソースID: \`${p.resourceId}\``);
    if (p.topK) md.appendMarkdown(`\n- topK: ${p.topK}`);

    return {
      invocationMessage: `Databricks ${p.mode} 実行中...`,
      confirmationMessages: {
        title: 'Databricks 検索の実行',
        message: md,
      },
    };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<DbxSearchParameters>,
    token: vscode.CancellationToken
  ) {
    const p = options.input;
    this.validate(p);
    const gateway = new GatewayClient(this.logger);

    try {
      let result: unknown;
      switch (p.mode) {
        case 'sql': {
          const initial = await gateway.executeSql({ statement: p.query! });
          let state = (initial?.status?.state ?? initial?.state) as string | undefined;
          let current = initial;
          const statementId = (initial?.statement_id ?? initial?.statementId) as string | undefined;
          const deadline = Date.now() + 25_000; // additional ~25s polling
          while (!token.isCancellationRequested && statementId && state && !['SUCCEEDED', 'FAILED', 'CANCELED'].includes(state) && Date.now() < deadline) {
            await new Promise((r) => setTimeout(r, 1000));
            current = await gateway.getStatement(statementId);
            state = (current?.status?.state ?? current?.state) as string | undefined;
          }

          // Handle EXTERNAL_LINKS expansion best-effort
          const res: any = current?.result ?? current?.response?.result ?? current;
          if (res?.disposition === 'EXTERNAL_LINKS') {
            const links: string[] = [];
            // Accept various shapes
            if (Array.isArray(res?.external_links)) {
              for (const it of res.external_links) {
                if (typeof it === 'string') links.push(it);
                else if (typeof it?.external_link === 'string') links.push(it.external_link);
                else if (typeof it?.link === 'string') links.push(it.link);
              }
            }
            if (links.length > 0) {
              const parts: string[] = [];
              for (const url of links) {
                try {
                  const fetched = await gateway.fetchExternalLink(url);
                  if (fetched?.text) parts.push(fetched.text);
                } catch (e) {
                  this.logger.warn('External link fetch failed', e);
                }
              }
              result = { ...current, expanded_external_text: parts.join('\n') };
            } else {
              result = current;
            }
          } else {
            result = current;
          }
          break;
        }
        case 'query': {
          if (p.operation === 'list') {
            result = await gateway.queriesList();
          } else {
            result = await gateway.getQueryById({ id: p.resourceId! });
          }
          break;
        }
        case 'vector': {
          switch (p.operation) {
            case 'listEndpoints':
              result = await gateway.vectorListEndpoints();
              break;
            case 'getEndpoint':
              result = await gateway.vectorGetEndpoint(p.resourceId!);
              break;
            case 'listIndexes':
              result = await gateway.vectorListIndexes();
              break;
            case 'getIndex':
              result = await gateway.vectorGetIndex(p.resourceId!);
              break;
            case 'nextPage':
              result = await gateway.vectorQueryNextPage({ indexName: p.resourceId!, query: p.query, next_page_token: p.nextPageToken! });
              break;
            case 'scan':
              result = await gateway.vectorScan(p.resourceId!, p.topK, undefined);
              break;
            default:
              result = await gateway.vectorSearch({ indexName: p.resourceId!, query: p.query!, topK: p.topK });
          }
          break;
        }
        case 'serving': {
          switch (p.operation) {
            case 'list':
              result = await gateway.servingList();
              break;
            case 'get':
              result = await gateway.servingGet(p.resourceId!);
              break;
            case 'openapi':
              result = await gateway.servingOpenapi(p.resourceId!);
              break;
            case 'invoke':
            default:
              result = await gateway.servingInvoke({ endpoint: p.resourceId!, input: p.payload ?? { input: p.query ?? '' } });
          }
          break;
        }
        case 'genie': {
          switch (p.operation) {
            case 'listSpaces':
              result = await gateway.genieListSpaces();
              break;
            case 'getSpace':
              result = await gateway.genieGetSpace(p.resourceId!);
              break;
            case 'listConversations':
              result = await gateway.genieListConversations(p.resourceId!);
              break;
            case 'createMessage':
              result = await gateway.genieCreateMessage(p.resourceId!, p.conversationId!, p.payload ?? { body: p.query });
              break;
            case 'getMessage':
              result = await gateway.genieGetMessage(p.resourceId!, p.conversationId!, p.messageId!);
              break;
            case 'executeAttachmentQuery':
              result = await gateway.genieExecAttachmentQuery(p.resourceId!, p.conversationId!, p.messageId!, p.attachmentId!);
              break;
            case 'getAttachmentQueryResult':
              result = await gateway.genieGetAttachmentResult(p.resourceId!, p.conversationId!, p.messageId!, p.attachmentId!);
              break;
            case 'startConversation':
              result = await gateway.genieStartConversation(p.resourceId!, p.query);
              break;
            default:
              // Backward-compat simple ask (if server supports it)
              result = await gateway.genieAsk({ spaceId: p.resourceId!, question: p.query! });
          }
          break;
        }
      }

      const parts = this.formatResult(result, p.format ?? 'markdown');
      return new vscode.LanguageModelToolResult(parts);
    } catch (err) {
      const msg = this.humanizeError(err);
      this.logger.error('DbxSearchTool failed', err);
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(msg)]);
    }
  }

  private validate(p: DbxSearchParameters) {
    if (!p.mode) throw new Error('mode は必須です');
    if (p.mode === 'sql' && !p.query) throw new Error('SQL モードでは query が必須です');
    if (p.mode === 'vector' && (!p.query || !p.resourceId)) throw new Error('vector モードでは query と resourceId が必須です');
    if (p.mode === 'serving' && !p.resourceId) throw new Error('serving モードでは resourceId (エンドポイント名) が必須です');
    if (p.mode === 'genie' && (!p.query || !p.resourceId)) throw new Error('genie モードでは query (質問) と resourceId (スペースID) が必須です');
    if (p.mode === 'query' && !p.resourceId) throw new Error('query モードでは resourceId (クエリID) が必須です');
  }

  private formatResult(result: unknown, format: 'markdown' | 'json'): vscode.LanguageModelResponsePart[] {
    if (format === 'json') {
      return [new vscode.LanguageModelTextPart(JSON.stringify(result, null, 2))];
    }

    const md = new vscode.MarkdownString();
    md.appendMarkdown('### Databricks 検索結果');
    md.appendMarkdown('\n');
    md.appendCodeblock(JSON.stringify(result, null, 2), 'json');
    return [new vscode.LanguageModelTextPart(md.value)] as vscode.LanguageModelResponsePart[];
  }

  private trunc(s: string, max = 200) {
    return s.length > max ? `${s.slice(0, max)}…` : s;
  }

  private humanizeError(err: unknown): string {
    const e = err as Error;
    if (e?.message?.includes('タイムアウト')) {
      return 'Gateway API がタイムアウトしました。時間をおいて再試行してください。';
    }
    if (e?.message?.includes('Gateway URL')) {
      return e.message;
    }
    return `実行中にエラーが発生しました: ${e?.message ?? String(err)}`;
  }
}
