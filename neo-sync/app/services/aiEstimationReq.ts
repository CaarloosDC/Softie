import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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

Responde en JSON:
{
  "horas_totales": [total realista basado en complejidad],
  "desglose": {
    "analisis": [horas],
    "desarrollo": [horas],
    "pruebas": [horas],
    "documentacion": [horas]
  },
  "justificacion": "explicación breve basada en la complejidad específica",
  "nivel_confianza": "alto/medio/bajo"
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Eres un experto en estimación de software. Analiza cada requerimiento individualmente y proporciona estimaciones variadas según su complejidad real."
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini",
      temperature: 0.7, // Increased for more variation
      response_format: { type: "json_object" }
    });

    console.log("AI Response:", completion.choices[0].message.content);
    return JSON.parse(completion.choices[0].message.content || "{}") as EstimationResponse;
  } catch (error) {
    console.error("Estimation error:", error);
    throw error;
  }
}