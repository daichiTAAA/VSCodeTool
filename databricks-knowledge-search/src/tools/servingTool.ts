import * as vscode from 'vscode';
import { Logger } from '../utils/logger';
import { GatewayClient } from '../services/gatewayClient';

interface IServingParams { operation?: 'invoke'|'list'|'get'|'openapi'; endpoint?: string; payload?: unknown }

export class ServingTool implements vscode.LanguageModelTool<IServingParams> {
  constructor(private logger: Logger) {}

  async invoke(options: vscode.LanguageModelToolInvocationOptions<IServingParams>): Promise<vscode.LanguageModelToolResult> {
    const p = options.input;
    const g = new GatewayClient(this.logger);
    try {
      let result: any;
      switch (p.operation ?? 'invoke') {
        case 'list': result = await g.servingList(); break;
        case 'get': result = await g.servingGet(p.endpoint!); break;
        case 'openapi': result = await g.servingOpenapi(p.endpoint!); break;
        case 'invoke':
        default:
          result = await g.servingInvoke({ endpoint: p.endpoint!, input: p.payload ?? {} });
      }
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(new vscode.MarkdownString().appendCodeblock(JSON.stringify(result, null, 2), 'json').value)]);
    } catch (e) {
      this.logger.error('Serving tool failed', e);
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${(e as Error).message}`)]);
    }
  }
}

