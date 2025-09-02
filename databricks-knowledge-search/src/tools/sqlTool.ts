import * as vscode from 'vscode';
import { Logger } from '../utils/logger';
import { GatewayClient } from '../services/gatewayClient';

interface ISqlParams {
  statement: string;
  warehouseId: string;
  catalog?: string;
  schema?: string;
  parameters?: Record<string, unknown>;
  resultFormat?: 'JSON_ARRAY' | 'ARROW_STREAM' | 'CSV';
  disposition?: 'INLINE' | 'EXTERNAL_LINKS';
  waitTimeout?: string;
  onWaitTimeout?: 'CONTINUE' | 'CANCEL';
  format?: 'markdown' | 'json'; // display format
}

export class SqlTool implements vscode.LanguageModelTool<ISqlParams> {
  constructor(private logger: Logger) {}

  async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<ISqlParams>) {
    const md = new vscode.MarkdownString();
    md.appendMarkdown('Databricks SQL を実行します。');
    md.appendCodeblock(options.input.statement, 'sql');
    md.appendMarkdown(`\n- warehouseId: ${options.input.warehouseId}`);
    return { invocationMessage: 'Executing SQL on Databricks', confirmationMessages: { title: 'Execute SQL', message: md } };
  }

  async invoke(options: vscode.LanguageModelToolInvocationOptions<ISqlParams>, token: vscode.CancellationToken) {
    const gateway = new GatewayClient(this.logger);
    try {
      // Fallback to configured default warehouse id if not provided
      const cfg = vscode.workspace.getConfiguration('databricks-knowledge-search');
      const fallbackWh = (cfg.get<string>('defaultWarehouseId') || '').trim() || undefined;
      const warehouseId = options.input.warehouseId || fallbackWh;
      if (!warehouseId) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart('warehouseId が指定されていません。設定 databricks-knowledge-search.defaultWarehouseId を指定するか、パラメータで warehouseId を渡してください。')
        ]);
      }

      const initial: any = await gateway.executeSql({
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
      const statementId = (initial?.statement_id ?? initial?.statementId) as string | undefined;
      let state = (initial?.status?.state ?? initial?.state) as string | undefined;
      let current: any = initial;
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
            try { const fetched: any = await gateway.fetchExternalLink(url); if (fetched?.text) texts.push(fetched.text); } catch (e) { this.logger.warn('External link fetch failed', e as any); }
          }
        }
        current = { ...(current as any), expanded_external_text: texts.join('\n') } as any;
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
