import { ollamaClient } from '@/lib/ollama/client/ollamaClient';


interface EstimationResponse {
  horas_totales: number;
  desglose: {
    analisis: number;
    desarrollo: number;
    pruebas: number;
    documentacion: number;
  };
  justificacion: string;
  nivel_confianza: string;
}

export async function estimateRequirementEffort({
  nombre,
  descripcion,
  tipo
}: {
  nombre: string;
  descripcion: string;
  tipo?: string;
}): Promise<EstimationResponse> {
  const prompt = `Estima las horas necesarias para este requerimiento de software:

Nombre: ${nombre}
Descripción: ${descripcion}
Tipo: ${tipo || 'No especificado'}

Considera la complejidad específica del requerimiento. NO uses estimaciones genéricas.
La estimación debe variar según el alcance y complejidad real del requerimiento.

Responde en JSON, no incluyas explicaciones adicionales, solamente el JSON con la estimación:
{
  "tiempo_requerimiento": [total realista basado en complejidad],
  "desglose": {
    "analisis": [horas],
    "desarrollo": [horas],
    "pruebas": [horas],
    "documentacion": [horas]
  }
}`;

  try {
    const completion = await ollamaClient.chat({
      messages: [
        { 
          role: "system", 
          content: "Eres un experto en estimación de software. Analiza cada requerimiento individualmente y proporciona estimaciones variadas según su complejidad real."
        },
        { role: "user", content: prompt }
      ],
      model: process.env.OLLAMA_MODEL || 'llama3.1',
    });

    console.log("AI Response:", completion.message.content);
    return JSON.parse(completion.message.content) as EstimationResponse;
  } catch (error) {
    console.error("Estimation error:", error);
    throw error;
  }
}