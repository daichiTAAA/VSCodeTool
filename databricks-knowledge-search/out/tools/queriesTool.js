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
exports.QueriesTool = void 0;
const vscode = __importStar(require("vscode"));
const gatewayClient_1 = require("../services/gatewayClient");
class QueriesTool {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async invoke(options) {
        const p = options.input;
        const g = new gatewayClient_1.GatewayClient(this.logger);
        try {
            const result = (p.operation ?? 'list') === 'list' ? await g.queriesList() : await g.getQueryById({ id: p.id });
            return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(new vscode.MarkdownString().appendCodeblock(JSON.stringify(result, null, 2), 'json').value)]);
        }
        catch (e) {
            this.logger.error('Queries tool failed', e);
            return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${e.message}`)]);
        }
    }
}
exports.QueriesTool = QueriesTool;
//# sourceMappingURL=queriesTool.js.map