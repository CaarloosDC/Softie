import { ollamaClient } from "../client/ollamaClient";


export async function generateAnswer(question: string, context: string) {
  // Construct a prompt with the context
  const prompt = `Utiliza el siguiente contexto para cumplir con la siguiente solicitud:
${context}

Solicitud: Genera un json en base a la descripcion del proyecto proporcionada a continuacion, crea una estimacion inicial para el campo costo, e incluye una version simplificada de la descripcion proveida para el campo descripcion, esta es la descripcion: ${question}

Formato: Tu respuesta debe estar estructurada como el siguiente JSON. No puedes incluir ningún otro texto que no sea el JSON. Dar explicaciones u otro texto que no sea la siguiente estructura JSON está prohibido:

{
  "nombre": string,
  "descripcion": string,
  "costo": number,
  "transcripcion": string,
  "giro_empresa": string,
  "orden": null,
}

Por favor, proporciona tu respuesta en el formato JSON especificado.`;

  // Generate response from Llama 3.1
  const response = await ollamaClient.chat({ model: 'llama3.1', messages: [{ role: 'user', content: prompt }] });

  console.log(response.message.content);

  const jsonResponse = JSON.parse(response.message.content);
  
  // Return the generated text
  return jsonResponse; // Returns a string
}