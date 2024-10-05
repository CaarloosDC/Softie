import { Ollama } from 'ollama';
export declare const ollamaClient: Ollama;
export declare function generateJSONResponse(responseFormat: string, query: string, systemContext: string): Promise<import("ollama").ChatResponse>;
