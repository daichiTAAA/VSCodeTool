import * as vscode from 'vscode';
import { Logger } from '../utils/logger';
import { AuthService } from './authService';

export interface SqlExecuteRequest {
  statement: string;
  warehouse_id?: string;
  catalog?: string;
  schema?: string;
  parameters?: Record<string, unknown>;
  wait_timeout?: string;
  on_wait_timeout?: string;
  format?: 'JSON_ARRAY' | 'ARROW_STREAM' | 'CSV';
  disposition?: 'INLINE' | 'EXTERNAL_LINKS';
}
export interface VectorSearchRequest { indexName: string; query: string; topK?: number; }
export interface QueryByIdRequest { id: string; }
export interface ServingInvokeRequest { endpoint: string; input: unknown; }
export interface GenieAskRequest { spaceId: string; question: string; }
export interface PagingRequest { indexName: string; next_page_token: string; query?: string }

export class GatewayClient {
  private baseUrl: string;
  private timeoutMs: number;
  private logger: Logger;
  private auth: AuthService;

  constructor(logger: Logger) {
    const cfg = vscode.workspace.getConfiguration('databricks-knowledge-search');
    this.baseUrl = cfg.get<string>('gatewayUrl', '');
    this.timeoutMs = cfg.get<number>('timeout', 10000);
    this.logger = logger;
    this.auth = new AuthService();
  }

  // ----- SQL (hybrid) -----
  async executeSql(req: SqlExecuteRequest): Promise<any> {
    const body = { wait_timeout: '10s', on_wait_timeout: 'CONTINUE', ...req };
    return this.post('/api/2.0/sql/statements', body);
  }

  async getStatement(statementId: string): Promise<any> {
    return this.get(`/api/2.0/sql/statements/${encodeURIComponent(statementId)}`);
  }

  async getResultChunk(statementId: string, chunkIndex: number): Promise<any> {
    return this.get(`/api/2.0/sql/statements/${encodeURIComponent(statementId)}/result/chunks/${chunkIndex}`);
  }

  async fetchExternalLink(url: string): Promise<any> {
    // Gateway helper to ensure no Authorization header is sent to SAS
    return this.post('/api/2.0/sql/statements/external-links/fetch', { url });
  }

  // ----- Other APIs -----
  async getQueryById(req: QueryByIdRequest): Promise<any> {
    return this.get(`/api/2.0/sql/queries/${encodeURIComponent(req.id)}`);
  }

  async vectorSearch(req: VectorSearchRequest): Promise<any> {
    return this.post('/api/2.0/vector-search/indexes/query', req);
  }

  async servingInvoke(req: ServingInvokeRequest): Promise<any> {
    return this.post(`/api/2.0/serving-endpoints/${encodeURIComponent(req.endpoint)}/invocations`, req.input);
  }

  async genieAsk(req: GenieAskRequest): Promise<any> {
    return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(req.spaceId)}/ask`, { question: req.question });
  }

  // ----- Serving Endpoints admin/listing -----
  async servingList(): Promise<any> { return this.get('/api/2.0/serving-endpoints'); }
  async servingGet(name: string): Promise<any> { return this.get(`/api/2.0/serving-endpoints/${encodeURIComponent(name)}`); }
  async servingOpenapi(name: string): Promise<any> { return this.get(`/api/2.0/serving-endpoints/${encodeURIComponent(name)}/openapi`); }

  // ----- Vector Search endpoints/indexes -----
  async vectorListEndpoints(): Promise<any> { return this.get('/api/2.0/vector-search/endpoints'); }
  async vectorGetEndpoint(name: string): Promise<any> { return this.get(`/api/2.0/vector-search/endpoints/${encodeURIComponent(name)}`); }
  async vectorListIndexes(): Promise<any> { return this.get('/api/2.0/vector-search/indexes'); }
  async vectorGetIndex(name: string): Promise<any> { return this.get(`/api/2.0/vector-search/indexes/${encodeURIComponent(name)}`); }
  async vectorQueryNextPage(req: PagingRequest): Promise<any> { return this.post('/api/2.0/vector-search/indexes/query/next-page', req); }
  async vectorScan(indexName: string, num_results?: number, primary_key?: string): Promise<any> {
    return this.post('/api/2.0/vector-search/indexes/scan', { indexName, num_results, primary_key });
  }

  // ----- Queries API -----
  async queriesList(): Promise<any> { return this.get('/api/2.0/sql/queries'); }

  // ----- Genie API -----
  async genieListSpaces(): Promise<any> { return this.get('/api/2.0/genie/spaces'); }
  async genieGetSpace(spaceId: string): Promise<any> { return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}`); }
  async genieListConversations(spaceId: string): Promise<any> { return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations`); }
  async genieCreateMessage(spaceId: string, conversationId: string, body: unknown): Promise<any> {
    return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages`, body);
  }
  async genieGetMessage(spaceId: string, conversationId: string, messageId: string): Promise<any> {
    return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`);
  }
  async genieExecAttachmentQuery(spaceId: string, conversationId: string, messageId: string, attachmentId: string): Promise<any> {
    return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}/execute-query`, {});
  }
  async genieGetAttachmentResult(spaceId: string, conversationId: string, messageId: string, attachmentId: string): Promise<any> {
    return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}/query-result`);
  }
  async genieStartConversation(spaceId: string, title?: string): Promise<any> {
    return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/start-conversation`, title ? { title } : {});
  }
  // ----- HTTP helpers -----
  private async get(path: string): Promise<any> {
    return this.request('GET', path);
  }

  private async post(path: string, body: unknown): Promise<any> {
    return this.request('POST', path, body);
  }

  private async request(method: 'GET' | 'POST', path: string, body?: unknown): Promise<any> {
    if (!this.baseUrl) {
      throw new Error('Gateway URL が設定されていません。設定 "databricks-knowledge-search.gatewayUrl" を確認してください。');
    }
    const url = `${this.baseUrl.replace(/\/$/, '')}${path}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const authHeader = this.auth.getAuthHeader();
    if (authHeader) Object.assign(headers, authHeader);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
        signal: controller.signal,
      } as RequestInit);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Gateway API Error: ${res.status} ${res.statusText} ${text}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await res.json();
      }
      return await res.text();
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        throw new Error('Gateway API タイムアウト');
      }
      this.logger.error('Gateway request failed', e);
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
}
