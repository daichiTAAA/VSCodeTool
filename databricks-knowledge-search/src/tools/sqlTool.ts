import * as vscode from 'vscode';
import { Logger } from '../utils/logger';
import { GatewayClient } from '../services/gatewayClient';

interface ISqlParams { statement: string; format?: 'markdown' | 'json' }

export class SqlTool implements vscode.LanguageModelTool<ISqlParams> {
  constructor(private logger: Logger) {}

  async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<ISqlParams>) {
    const md = new vscode.MarkdownString();
    md.appendMarkdown('Databricks SQL を実行します。');
    md.appendCodeblock(options.input.statement, 'sql');
    return { invocationMessage: 'Executing SQL on Databricks', confirmationMessages: { title: 'Execute SQL', message: md } };
  }

  async invoke(options: vscode.LanguageModelToolInvocationOptions<ISqlParams>, token: vscode.CancellationToken) {
    const gateway = new GatewayClient(this.logger);
    try {
      const initial = await gateway.executeSql({ statement: options.input.statement });
      const statementId = (initial?.statement_id ?? initial?.statementId) as string | undefined;
      let state = (initial?.status?.state ?? initial?.state) as string | undefined;
      let current = initial;
      const deadline = Date.now() + 25_000;
      while (!token.isCancellationRequested && statementId && state && !['SUCCEEDED', 'FAILED', 'CANCELED'].includes(state) && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 1000));
        current = await gateway.getStatement(statementId);
        state = (current?.status?.state ?? current?.state) as string | undefined;
      }
      // EXTERNAL_LINKS expansion
      const res: any = current?.result ?? current;
      if (res?.disposition === 'EXTERNAL_LINKS' && Array.isArray(res?.external_links)) {
        const texts: string[] = [];
        for (const it of res.external_links) {
          const url = typeof it === 'string' ? it : (it?.external_link ?? it?.link);
          if (typeof url === 'string') {
            try { const fetched = await gateway.fetchExternalLink(url); if (fetched?.text) texts.push(fetched.text); } catch (e) { this.logger.warn('External link fetch failed', e); }
          }
        }
        current = { ...current, expanded_external_text: texts.join('\n') };
      }

      const part = options.input.format === 'json'
        ? new vscode.LanguageModelTextPart(JSON.stringify(current, null, 2))
        : new vscode.LanguageModelTextPart(new vscode.MarkdownString().appendCodeblock(JSON.stringify(current, null, 2), 'json').value);
      return new vscode.LanguageModelToolResult([part]);
    } catch (e) {
      const msg = (e as Error).message ?? String(e);
      this.logger.error('SQL tool failed', e);
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${msg}`)]);
    }
  }
}

