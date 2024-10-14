import { OllamaEmbeddings } from "@langchain/ollama";

export const ollamaEmbeddingClient = new OllamaEmbeddings({
    model: "jmorgan/gte-small", // Default value
    baseUrl: "http://localhost:11434", // Default value
});