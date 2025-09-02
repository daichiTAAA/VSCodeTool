import * as vscode from 'vscode';
import { Logger } from '../utils/logger';
import { GatewayClient } from '../services/gatewayClient';

interface IVectorParams {
  operation?: 'query' | 'nextPage' | 'scan' | 'listEndpoints' | 'getEndpoint' | 'listIndexes' | 'getIndex';
  indexName?: string;
  query?: string;
  topK?: number;
  nextPageToken?: string;
  endpointName?: string;
}

export class VectorTool implements vscode.LanguageModelTool<IVectorParams> {
  constructor(private logger: Logger) {}

  async invoke(options: vscode.LanguageModelToolInvocationOptions<IVectorParams>): Promise<vscode.LanguageModelToolResult> {
    const p = options.input;
    const g = new GatewayClient(this.logger);
    try {
      let result: any;
      switch (p.operation ?? 'query') {
        case 'listEndpoints': result = await g.vectorListEndpoints(); break;
        case 'getEndpoint': result = await g.vectorGetEndpoint(p.endpointName ?? p.indexName!); break;
        case 'listIndexes': result = await g.vectorListIndexes(); break;
        case 'getIndex': result = await g.vectorGetIndex(p.indexName!); break;
        case 'nextPage': result = await g.vectorQueryNextPage({ indexName: p.indexName!, next_page_token: p.nextPageToken!, query: p.query }); break;
        case 'scan': result = await g.vectorScan(p.indexName!, p.topK, undefined); break;
        case 'query':
        default:
          result = await g.vectorSearch({ indexName: p.indexName!, query: p.query!, topK: p.topK });
      }
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(new vscode.MarkdownString().appendCodeblock(JSON.stringify(result, null, 2), 'json').value)]);
    } catch (e) {
      this.logger.error('Vector tool failed', e);
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${(e as Error).message}`)]);
    }
  }
}

