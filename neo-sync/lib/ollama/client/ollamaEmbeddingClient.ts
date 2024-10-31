import { OllamaEmbeddings } from "@langchain/ollama";

const baseUrl = process.env.OLLAMA_BASE_URL

export const ollamaEmbeddingClient = new OllamaEmbeddings({
    model: "jmorgan/gte-small", // Default value
    baseUrl: baseUrl, // Default value
});