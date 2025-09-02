import * as vscode from 'vscode';
import { Logger } from '../utils/logger';
import { GatewayClient } from '../services/gatewayClient';

interface IQueriesParams { operation?: 'list'|'get'; id?: string }

export class QueriesTool implements vscode.LanguageModelTool<IQueriesParams> {
  constructor(private logger: Logger) {}

  async invoke(options: vscode.LanguageModelToolInvocationOptions<IQueriesParams>): Promise<vscode.LanguageModelToolResult> {
    const p = options.input;
    const g = new GatewayClient(this.logger);
    try {
      const result = (p.operation ?? 'list') === 'list' ? await g.queriesList() : await g.getQueryById({ id: p.id! });
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(new vscode.MarkdownString().appendCodeblock(JSON.stringify(result, null, 2), 'json').value)]);
    } catch (e) {
      this.logger.error('Queries tool failed', e);
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${(e as Error).message}`)]);
    }
  }
}

