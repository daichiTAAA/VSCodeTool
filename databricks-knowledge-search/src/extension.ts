import * as vscode from 'vscode';
import { DbxSearchTool } from './tools/dbxSearchTool';
import { Logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
  const logger = Logger.init('Databricks Knowledge Search');
  logger.info('Activating extension');

  const tool = new DbxSearchTool(logger);
  context.subscriptions.push(
    vscode.lm.registerTool('databricks-knowledge-search_search', tool)
  );

  logger.info('Tool registered: databricks-knowledge-search_search');
}

export function deactivate() {
  // no-op
}

