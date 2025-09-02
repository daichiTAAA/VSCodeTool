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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const sqlTool_1 = require("./tools/sqlTool");
const vectorTool_1 = require("./tools/vectorTool");
const servingTool_1 = require("./tools/servingTool");
const queriesTool_1 = require("./tools/queriesTool");
const genieTool_1 = require("./tools/genieTool");
const logger_1 = require("./utils/logger");
function activate(context) {
    const logger = logger_1.Logger.init('Databricks Knowledge Search');
    logger.info('Activating extension');
    context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_sql', new sqlTool_1.SqlTool(logger)));
    context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_vector', new vectorTool_1.VectorTool(logger)));
    context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_serving', new servingTool_1.ServingTool(logger)));
    context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_queries', new queriesTool_1.QueriesTool(logger)));
    context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_genie', new genieTool_1.GenieTool(logger)));
    logger.info('Tools registered');
}
function deactivate() {
    // no-op
}
//# sourceMappingURL=extension.js.map