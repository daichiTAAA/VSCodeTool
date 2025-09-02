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
exports.Logger = void 0;
const vscode = __importStar(require("vscode"));
class Logger {
    static channel;
    static init(name) {
        if (!Logger.channel) {
            Logger.channel = vscode.window.createOutputChannel(name, { log: true });
        }
        return new Logger();
    }
    static get instance() {
        if (!Logger.channel) {
            throw new Error('Logger not initialized');
        }
        return new Logger();
    }
    info(message, ...args) {
        Logger.channel?.appendLine(`[INFO] ${message} ${this.formatArgs(args)}`);
    }
    warn(message, ...args) {
        Logger.channel?.appendLine(`[WARN] ${message} ${this.formatArgs(args)}`);
    }
    error(message, error) {
        const e = error instanceof Error ? `${error.message}\n${error.stack}` : String(error ?? '');
        Logger.channel?.appendLine(`[ERROR] ${message} ${e}`);
    }
    formatArgs(args) {
        if (!args || args.length === 0)
            return '';
        try {
            return args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
        }
        catch {
            return '';
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map