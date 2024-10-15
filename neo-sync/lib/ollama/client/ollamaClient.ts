import { Ollama } from 'ollama'


export const ollamaClient = new Ollama({ host: 'http://127.0.0.1:11434' })