import { ollamaClient } from "../client/ollamaClient";


export async function generateAnswer(question: string, context: string) {
  // Construct a prompt with the context
  const prompt = `Use the following context to answer the question:\n\n${context}\n\nQuestion: ${question}`;

  // Generate response from Llama 3.1
  const response = await ollamaClient.chat({ model: 'llama-3.1', messages: [{ role: 'user', content: 'Why is the sky blue?' }]});
  
  // Return the generated text
  return response.message.content;
}