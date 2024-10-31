import { StreamingTextResponse, Message } from "ai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOllama } from "langchain/chat_models/ollama";
import { BytesOutputParser } from "langchain/schema/output_parser";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.LLM_MODEL,
  });

  const parser = new BytesOutputParser();

  // Agregar el mensaje de sistema
  const systemMessage = new SystemMessage(
    "Tu nombre es Softie, eres un asistente de inteligencia artificial que busca asistir al usuario con dudas respecto a la generacion de requerimientos funcionales y no funcionales para proyectos de software, asi como otros temas relacionados con dicha materia"
  );

  // Incluir el mensaje de sistema en el array de mensajes
  const allMessages = [
    systemMessage,
    ...messages.map((m: Message) =>
      m.role === "user"
        ? new HumanMessage(m.content)
        : new AIMessage(m.content)
    ),
  ];

  const stream = await model.pipe(parser).stream(allMessages);

  return new StreamingTextResponse(stream);
}