import ollama from 'ollama'
import { createOllamaClient } from './setupClient'

const client = createOllamaClient('http://191.101.233.154:11434')

async function runChat() {
    const response = await client.chat({
        model: 'llama3.1',
        messages: [
            { role: 'user', content: 'Hello, how are you?' },
        ],
        format: 'json'
    })
    
    console.log(response)
}

runChat().catch(console.error)