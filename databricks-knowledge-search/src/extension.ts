import * as vscode from 'vscode';
import { SqlTool } from './tools/sqlTool';
import { VectorTool } from './tools/vectorTool';
import { ServingTool } from './tools/servingTool';
import { QueriesTool } from './tools/queriesTool';
import { GenieTool } from './tools/genieTool';
import { Logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
  const logger = Logger.init('Databricks Knowledge Search');
  logger.info('Activating extension');

  context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_sql', new SqlTool(logger)));
  context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_vector', new VectorTool(logger)));
  context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_serving', new ServingTool(logger)));
  context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_queries', new QueriesTool(logger)));
  context.subscriptions.push(vscode.lm.registerTool('databricks-knowledge-search_genie', new GenieTool(logger)));
  logger.info('Tools registered');
}

export function deactivate() {
  // no-op
}
