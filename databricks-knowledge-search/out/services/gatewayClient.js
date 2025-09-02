"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayClient = void 0;
const vscode = __importStar(require("vscode"));
const authService_1 = require("./authService");
class GatewayClient {
    baseUrl;
    timeoutMs;
    logger;
    auth;
    constructor(logger) {
        const cfg = vscode.workspace.getConfiguration('databricks-knowledge-search');
        this.baseUrl = cfg.get('gatewayUrl', '');
        this.timeoutMs = cfg.get('timeout', 10000);
        this.logger = logger;
        this.auth = new authService_1.AuthService();
    }
    // ----- SQL (hybrid) -----
    async executeSql(req) {
        const body = { wait_timeout: '10s', on_wait_timeout: 'CONTINUE', ...req };
        return this.post('/api/2.0/sql/statements', body);
    }
    async getStatement(statementId) {
        return this.get(`/api/2.0/sql/statements/${encodeURIComponent(statementId)}`);
    }
    async getResultChunk(statementId, chunkIndex) {
        return this.get(`/api/2.0/sql/statements/${encodeURIComponent(statementId)}/result/chunks/${chunkIndex}`);
    }
    async fetchExternalLink(url) {
        // Gateway helper to ensure no Authorization header is sent to SAS
        return this.post('/api/2.0/sql/statements/external-links/fetch', { url });
    }
    // ----- Other APIs -----
    async getQueryById(req) {
        return this.get(`/api/2.0/sql/queries/${encodeURIComponent(req.id)}`);
    }
    async vectorSearch(req) {
        return this.post('/api/2.0/vector-search/indexes/query', req);
    }
    async servingInvoke(req) {
        return this.post(`/api/2.0/serving-endpoints/${encodeURIComponent(req.endpoint)}/invocations`, req.input);
    }
    async genieAsk(req) {
        return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(req.spaceId)}/ask`, { question: req.question });
    }
    // ----- Serving Endpoints admin/listing -----
    async servingList() { return this.get('/api/2.0/serving-endpoints'); }
    async servingGet(name) { return this.get(`/api/2.0/serving-endpoints/${encodeURIComponent(name)}`); }
    async servingOpenapi(name) { return this.get(`/api/2.0/serving-endpoints/${encodeURIComponent(name)}/openapi`); }
    // ----- Vector Search endpoints/indexes -----
    async vectorListEndpoints() { return this.get('/api/2.0/vector-search/endpoints'); }
    async vectorGetEndpoint(name) { return this.get(`/api/2.0/vector-search/endpoints/${encodeURIComponent(name)}`); }
    async vectorListIndexes() { return this.get('/api/2.0/vector-search/indexes'); }
    async vectorGetIndex(name) { return this.get(`/api/2.0/vector-search/indexes/${encodeURIComponent(name)}`); }
    async vectorQueryNextPage(req) { return this.post('/api/2.0/vector-search/indexes/query/next-page', req); }
    async vectorScan(indexName, num_results, primary_key) {
        return this.post('/api/2.0/vector-search/indexes/scan', { indexName, num_results, primary_key });
    }
    // ----- Queries API -----
    async queriesList() { return this.get('/api/2.0/sql/queries'); }
    // ----- Genie API -----
    async genieListSpaces() { return this.get('/api/2.0/genie/spaces'); }
    async genieGetSpace(spaceId) { return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}`); }
    async genieListConversations(spaceId) { return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations`); }
    async genieCreateMessage(spaceId, conversationId, body) {
        return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages`, body);
    }
    async genieGetMessage(spaceId, conversationId, messageId) {
        return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`);
    }
    async genieExecAttachmentQuery(spaceId, conversationId, messageId, attachmentId) {
        return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}/execute-query`, {});
    }
    async genieGetAttachmentResult(spaceId, conversationId, messageId, attachmentId) {
        return this.get(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}/query-result`);
    }
    async genieStartConversation(spaceId, title) {
        return this.post(`/api/2.0/genie/spaces/${encodeURIComponent(spaceId)}/start-conversation`, title ? { title } : {});
    }
    // ----- HTTP helpers -----
    async get(path) {
        return this.request('GET', path);
    }
    async post(path, body) {
        return this.request('POST', path, body);
    }
    async request(method, path, body) {
        if (!this.baseUrl) {
            throw new Error('Gateway URL が設定されていません。設定 "databricks-knowledge-search.gatewayUrl" を確認してください。');
        }
        const url = `${this.baseUrl.replace(/\/$/, '')}${path}`;
        const headers = { 'Content-Type': 'application/json' };
        const authHeader = this.auth.getAuthHeader();
        if (authHeader)
            Object.assign(headers, authHeader);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
            const res = await fetch(url, {
                method,
                headers,
                body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
                signal: controller.signal,
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Gateway API Error: ${res.status} ${res.statusText} ${text}`);
            }
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await res.json();
            }
            return await res.text();
        }
        catch (e) {
            if (e.name === 'AbortError') {
                throw new Error('Gateway API タイムアウト');
            }
            this.logger.error('Gateway request failed', e);
            throw e;
        }
        finally {
            clearTimeout(timer);
        }
    }
}
exports.GatewayClient = GatewayClient;
//# sourceMappingURL=gatewayClient.js.map