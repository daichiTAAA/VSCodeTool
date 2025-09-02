import * as vscode from 'vscode';

export class AuthService {
  getAuthHeader(): Record<string, string> | undefined {
    const cfg = vscode.workspace.getConfiguration('databricks-knowledge-search');
    const token = cfg.get<string>('authToken')?.trim();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return undefined;
  }
}

