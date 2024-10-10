import type { THuggingFaceEmbeddingSingleton } from "./lib/ollama/ollama";

export {};

declare global {
    interface Window {
        HuggingFaceEmbeddingSingleton: ReturnType<THuggingFaceEmbeddingSingleton> | undefined; 
        VectorStoreSingleton: ReturnType<TVectorStore> | undefined;
    }
}
