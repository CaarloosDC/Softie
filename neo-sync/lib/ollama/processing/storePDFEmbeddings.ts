import { fetchAndParsePDF } from "./pdfParser";
import { ollamaEmbeddingClient } from "../client/ollamaEmbeddingClient";
import { supabase } from "@/lib/db";

function splitText(text: string, maxLength: number): string[] {
    const regex = new RegExp(`(.|[\r\n]){1,${maxLength}}`, 'g');
    return text.match(regex) || [];
}

export async function storePDFEmbeddings(filePath: string) {
    const pdfText = await fetchAndParsePDF(filePath);

    const maxLength = 384; // Ajusta este valor según sea necesario
    const textChunks = splitText(pdfText, maxLength);

    const embeddings = [];
    for (const chunk of textChunks) {
        const embedding = await ollamaEmbeddingClient.embedQuery(chunk);
        // Asegúrate de que cada embedding tenga exactamente 384 dimensiones
        if (embedding.length !== 384) {
            console.error('Embedding length mismatch:', embedding.length);
            throw new Error('Embedding length mismatch');
        }
        embeddings.push(embedding);
    }

    // Promediar los embeddings para obtener un solo vector de longitud 384
    const averagedEmbedding = embeddings.reduce((acc, curr) => {
        return acc.map((val, idx) => val + curr[idx]);
    }, new Array(384).fill(0)).map(val => val / embeddings.length);

    const { data, error } = await supabase.from("embeddings").insert([{
        content: pdfText,
        embedding: averagedEmbedding,
        metadata: { type: 'pdf', filePath: filePath }
    }]);

    if (error) {
        console.error('Error storing PDF content and embeddings:', error);
        throw new Error('Failed to store PDF content and embeddings');
    }

    return data;
}