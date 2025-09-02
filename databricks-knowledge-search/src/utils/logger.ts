import * as vscode from 'vscode';

export class Logger {
  private static channel: vscode.OutputChannel | undefined;

  static init(name: string) {
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

  info(message: string, ...args: unknown[]) {
    Logger.channel?.appendLine(`[INFO] ${message} ${this.formatArgs(args)}`);
  }

  warn(message: string, ...args: unknown[]) {
    Logger.channel?.appendLine(`[WARN] ${message} ${this.formatArgs(args)}`);
  }

  error(message: string, error?: unknown) {
    const e = error instanceof Error ? `${error.message}\n${error.stack}` : String(error ?? '');
    Logger.channel?.appendLine(`[ERROR] ${message} ${e}`);
  }

  private formatArgs(args: unknown[]) {
    if (!args || args.length === 0) return '';
    try {
      return args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
    } catch {
      return '';
    }
  }
}

