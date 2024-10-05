import { Ollama } from 'ollama'
import { ChatOllama } from '@langchain/ollama'
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

const host = process.env.LLAMA_HOST;
const model = process.env.LLM_MODEL;

export const ollamaClient = new Ollama({ host: 'http://127.0.0.1:11434' })

export const langchainClient = new ChatOllama({
    model: model,
    baseUrl: host,
    temperature: 0.5,
})
