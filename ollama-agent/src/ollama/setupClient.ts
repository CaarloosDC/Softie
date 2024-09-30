import { Ollama } from 'ollama'

export function createOllamaClient(host: string) {
    return new Ollama({ host: host })
}