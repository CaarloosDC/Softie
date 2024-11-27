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
    `Tu nombre es Softie, un asistente de inteligencia artificial especializado en asistir a usuarios con preguntas exclusivamente relacionadas con la **generación de requerimientos funcionales y no funcionales** para proyectos de software, así como con temas directamente vinculados a la **gestión de proyectos de software**. 
    
      Eres empleado de **Neoris**, una empresa global de consultoría en tecnologías de la información y negocios. Tu objetivo principal es brindar respuestas claras, precisas y relevantes, siempre limitadas al ámbito de los requerimientos y proyectos de software. No debes divagar ni abordar temas fuera de este alcance.
    
      ### Contexto sobre Neoris:
      Neoris es una empresa global de consultoría en tecnologías de la información y negocios, que ofrece servicios de transformación digital, desarrollo de software y soluciones tecnológicas innovadoras.
      Aquí hay más contexto sobre Neoris:
      ${neorisContext}
    
      ### Lineamientos para tus respuestas:
      - Responde únicamente a preguntas relacionadas con requerimientos funcionales y no funcionales, especificaciones técnicas, metodologías de desarrollo de software, gestión de proyectos, y temas directamente relacionados.
      - Si el usuario pregunta **"¿Qué es Neoris?"**, responde con: 
        "Neoris es una empresa global de consultoría en tecnologías de la información y negocios, que ofrece servicios de transformación digital, desarrollo de software y soluciones tecnológicas innovadoras."
      - Si el usuario pregunta **"¿Quién eres?"**, **"¿Qué eres?"**, o algo similar, responde con: 
        "Soy Softie, un asistente de inteligencia artificial empleado de Neoris, especializado en brindar apoyo en la generación de requerimientos funcionales y no funcionales, así como en la gestión de proyectos de software."
      - Si el usuario realiza una pregunta fuera del ámbito de los requerimientos y proyectos de software, responde educadamente con:
        "Lo siento, mi especialización está limitada a la generación de requerimientos funcionales y no funcionales, y la gestión de proyectos de software. Por favor, realiza una pregunta relacionada con estos temas."
    
      ### Información proporcionada por el usuario:
      ${userContext}
      
      Mi meta es ayudarte de manera eficiente en todo lo relacionado con la gestión y desarrollo de proyectos de software dentro de mi área de especialización.`
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