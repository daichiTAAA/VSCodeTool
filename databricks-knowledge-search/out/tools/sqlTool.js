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
exports.SqlTool = void 0;
const vscode = __importStar(require("vscode"));
const gatewayClient_1 = require("../services/gatewayClient");
class SqlTool {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async prepareInvocation(options) {
        const md = new vscode.MarkdownString();
        md.appendMarkdown('Databricks SQL を実行します。');
        md.appendCodeblock(options.input.statement, 'sql');
        md.appendMarkdown(`\n- warehouseId: ${options.input.warehouseId}`);
        return { invocationMessage: 'Executing SQL on Databricks', confirmationMessages: { title: 'Execute SQL', message: md } };
    }
    async invoke(options, token) {
        const gateway = new gatewayClient_1.GatewayClient(this.logger);
        try {
            // Fallback to configured default warehouse id if not provided
            const cfg = vscode.workspace.getConfiguration('databricks-knowledge-search');
            const fallbackWh = (cfg.get('defaultWarehouseId') || '').trim() || undefined;
            const warehouseId = options.input.warehouseId || fallbackWh;
            if (!warehouseId) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart('warehouseId が指定されていません。設定 databricks-knowledge-search.defaultWarehouseId を指定するか、パラメータで warehouseId を渡してください。')
                ]);
            }
            const initial = await gateway.executeSql({
                statement: options.input.statement,
                warehouse_id: warehouseId,
                catalog: options.input.catalog,
                schema: options.input.schema,
                parameters: options.input.parameters,
                format: options.input.resultFormat,
                disposition: options.input.disposition,
                wait_timeout: options.input.waitTimeout,
                on_wait_timeout: options.input.onWaitTimeout,
            });
            const statementId = (initial?.statement_id ?? initial?.statementId);
            let state = (initial?.status?.state ?? initial?.state);
            let current = initial;
            const deadline = Date.now() + 25_000;
            while (!token.isCancellationRequested && statementId && state && !['SUCCEEDED', 'FAILED', 'CANCELED'].includes(state) && Date.now() < deadline) {
                await new Promise((r) => setTimeout(r, 1000));
                current = await gateway.getStatement(statementId);
                state = (current?.status?.state ?? current?.state);
            }
            // EXTERNAL_LINKS expansion
            const res = current?.result ?? current;
            if (res?.disposition === 'EXTERNAL_LINKS' && Array.isArray(res?.external_links)) {
                const texts = [];
                for (const it of res.external_links) {
                    const url = typeof it === 'string' ? it : (it?.external_link ?? it?.link);
                    if (typeof url === 'string') {
                        try {
                            const fetched = await gateway.fetchExternalLink(url);
                            if (fetched?.text)
                                texts.push(fetched.text);
                        }
                        catch (e) {
                            this.logger.warn('External link fetch failed', e);
                        }
                    }
                }
                current = { ...current, expanded_external_text: texts.join('\n') };
            }
            const part = options.input.format === 'json'
                ? new vscode.LanguageModelTextPart(JSON.stringify(current, null, 2))
                : new vscode.LanguageModelTextPart(new vscode.MarkdownString().appendCodeblock(JSON.stringify(current, null, 2), 'json').value);
            return new vscode.LanguageModelToolResult([part]);
        }
        catch (e) {
            const msg = e.message ?? String(e);
            this.logger.error('SQL tool failed', e);
            return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${msg}`)]);
        }
    }
}
exports.SqlTool = SqlTool;
//# sourceMappingURL=sqlTool.js.map