import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface EstimationBreakdown {
  analisis: number;
  desarrollo: number;
  pruebas: number;
  documentacion: number;
}

interface EstimationResponse {
  horas_totales: number;
  desglose: EstimationBreakdown;
  justificacion: string;
  nivel_confianza: string;
}

interface RequirementData {
  nombre: string;
  descripcion: string;
  tipo?: string;
}

export async function estimateRequirementEffort(requirementData: RequirementData): Promise<EstimationResponse> {
  const prompt = `Como experto en gestión de proyectos de software, necesito una estimación precisa en HORAS para completar el siguiente requerimiento de software.

Nombre del requerimiento: ${requirementData.nombre}
Descripción: ${requirementData.descripcion}
Tipo: ${requirementData.tipo || 'No especificado'}

Instrucciones específicas:
1. La estimación debe ser en HORAS de trabajo efectivo
2. Considerar tiempo para: análisis, desarrollo, pruebas y documentación
3. Proporcionar un desglose del tiempo por actividad
4. La estimación debe ser realista para un desarrollador con experiencia media

Formato de respuesta requerido (JSON):
{
  "horas_totales": [número total de horas],
  "desglose": {
    "analisis": [horas],
    "desarrollo": [horas],
    "pruebas": [horas],
    "documentacion": [horas]
  },
  "justificacion": "[explicación breve de la estimación]",
  "nivel_confianza": "[alto/medio/bajo]"
}

Importante: Las horas deben ser números realistas y la suma del desglose debe igualar las horas totales.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Eres un experto en estimación de proyectos de software con amplia experiencia. Proporciona estimaciones realistas basadas en mejores prácticas de la industria. Tus estimaciones deben ser precisas y estar respaldadas por un análisis detallado."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    
    if (!response.horas_totales || typeof response.horas_totales !== 'number') {
      throw new Error("La estimación no devolvió un número válido de horas");
    }

    return response as EstimationResponse;
  } catch (error) {
    console.error("Error in AI estimation:", error);
    throw error;
  }
}