import * as vscode from 'vscode';
import { Logger } from '../utils/logger';
import { GatewayClient } from '../services/gatewayClient';

interface IGenieParams {
  operation?: 'listSpaces' | 'getSpace' | 'listConversations' | 'startConversation' | 'createMessage' | 'getMessage' | 'executeAttachmentQuery' | 'getAttachmentQueryResult';
  spaceId?: string;
  conversationId?: string;
  messageId?: string;
  attachmentId?: string;
  title?: string;
  body?: string;
  payload?: any;
}

export class GenieTool implements vscode.LanguageModelTool<IGenieParams> {
  constructor(private logger: Logger) {}

  async invoke(options: vscode.LanguageModelToolInvocationOptions<IGenieParams>): Promise<vscode.LanguageModelToolResult> {
    const p = options.input;
    const g = new GatewayClient(this.logger);
    try {
      let result: any;
      switch (p.operation ?? 'listSpaces') {
        case 'listSpaces': result = await g.genieListSpaces(); break;
        case 'getSpace': result = await g.genieGetSpace(p.spaceId!); break;
        case 'listConversations': result = await g.genieListConversations(p.spaceId!); break;
        case 'startConversation': result = await g.genieStartConversation(p.spaceId!, p.title); break;
        case 'createMessage': result = await g.genieCreateMessage(p.spaceId!, p.conversationId!, p.payload ?? { body: p.body }); break;
        case 'getMessage': result = await g.genieGetMessage(p.spaceId!, p.conversationId!, p.messageId!); break;
        case 'executeAttachmentQuery': result = await g.genieExecAttachmentQuery(p.spaceId!, p.conversationId!, p.messageId!, p.attachmentId!); break;
        case 'getAttachmentQueryResult': result = await g.genieGetAttachmentResult(p.spaceId!, p.conversationId!, p.messageId!, p.attachmentId!); break;
      }
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(new vscode.MarkdownString().appendCodeblock(JSON.stringify(result, null, 2), 'json').value)]);
    } catch (e) {
      this.logger.error('Genie tool failed', e);
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${(e as Error).message}`)]);
    }
  }
}

