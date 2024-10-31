import { StreamingTextResponse, Message } from "ai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOllama } from "langchain/chat_models/ollama";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { retrieveRelevantDocs } from "@/lib/ollama/retrieval/retrieveRelevantDocs";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.LLM_MODEL,
  });

  const parser = new BytesOutputParser();

  // Obtener el ultimo mensaje del usuario
  const userMessage = messages.find((m: Message) => m.role === "user");

  // Obtener el contexto de la empresa
  const neorisDocs = await retrieveRelevantDocs("Neoris");
  const neorisContext = neorisDocs.map((doc: { content: any; }) => doc.content).join('\n');

  // Obtener contexto relevante a la solicitud del usuario
  const userDocs = await retrieveRelevantDocs(userMessage.content);
  const userContext = userDocs.map((doc: { content: any; }) => doc.content).join('\n');

  // Agregar el mensaje de sistema
  const systemMessage = new SystemMessage(
    `Tu nombre es Softie, eres un asistente de inteligencia artificial que busca asistir al usuario con dudas respecto a la generacion de requerimientos funcionales y no funcionales para proyectos de software, asi como otros temas relacionados con dicha materia.

    Tu trabajas para la empresa Neoris. Neoris es una empresa global de consultoría en tecnologías de la información y negocios, que ofrece servicios de transformación digital, desarrollo de software, y soluciones tecnológicas innovadoras.

    Aquí hay un poco de contexto sobre Neoris:
    ${neorisContext}

    Aquí hay un poco de información relevante a la solicitud hecha por el usuario:
    ${userContext}

    Si el usuario pregunta "¿Qué es Neoris?", o algo similar donde solicite saber algo sobre Neoris, responde con: "Neoris es una empresa global de consultoría en tecnologías de la información y negocios, que ofrece servicios de transformación digital, desarrollo de software, y soluciones tecnológicas innovadoras."
    `
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