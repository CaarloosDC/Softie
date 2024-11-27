import { supabase } from "@/lib/db";
import { ollamaClient } from "../client/ollamaClient";
import { createAndStoreEmbeddings } from "./generateEmbeddings";
import { SupabaseClient } from "@supabase/supabase-js";
import { error } from "console";

export async function generateAnswer(question: string, context: string, jsonFormat: string, additionalData?: String) {
  // Construct a prompt with the context
  const prompt = `Utiliza el siguiente contexto para cumplir con la siguiente solicitud:
  ${context}

  Solicitud: Genera un json en base a la descripcion del proyecto proporcionada a continuacion, crea una estimacion inicial para el campo costo, e incluye una version simplificada de la descripcion proveida para el campo descripcion, esta es la descripcion: ${question}, tambien te puedes basar en esta transcripcion de la reunion con el cliente ${additionalData}.

  Formato: Tu respuesta debe estar estructurada como el siguiente JSON. No puedes incluir ningún otro texto que no sea el JSON. Dar explicaciones u otro texto que no sea la siguiente estructura JSON está prohibido:
  
  ${jsonFormat}

  Por favor, proporciona tu respuesta en el formato JSON especificado.`;

  // Generate response from Llama 3.1
  const response = await ollamaClient.chat({ model: process.env.OLLAMA_MODEL || 'llama3.1', messages: [{ role: 'user', content: prompt }] });

  console.log(response.message.content);

  // Convertir objeto a json para poder acceder a los valores
  const jsonResponse = JSON.parse(response.message.content);

  const { data, error } = await supabase.from("proyecto").insert([{
    nombre: jsonResponse.nombre,
    descripcion: jsonResponse.descripcion,
    costo: jsonResponse.costo,
    transcripcion: jsonResponse.transcripcion,
    giro_empresa: jsonResponse.giro_empresa,
  }]).select("id");

  if (error) {
    console.error('Error storing project:', error);
    throw new Error('Failed to store project');
  }

  const projectID = data[0].id;

  const requerimientos = jsonResponse.requerimientos.map((req: any) => ({
    ...req,
    proyecto_id: projectID
  }))

  const { error: reqError } = await supabase.from("requerimiento").insert(requerimientos);

  if (reqError) {
    console.error('Error storing requirements:', reqError);
    throw new Error('Failed to store requirements');
  }

  await createAndStoreEmbeddings(question, jsonResponse);
  
  // Return the generated text
  return jsonResponse; // Returns a string
}