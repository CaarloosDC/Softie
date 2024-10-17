import { Ollama } from 'ollama'

export const ollamaHost = process.env.OLLAMA_BASE_URL

export const ollamaClient = new Ollama({ host: 'http://127.0.0.1:11434' })