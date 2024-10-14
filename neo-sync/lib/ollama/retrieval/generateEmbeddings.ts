import { supabase } from "@/lib/db";
import { ollamaEmbeddingClient } from "../client/ollamaEmbeddingClient";
import { supabaseClient } from "@/supabase/client";


function splitText(text: string, maxLength: number): string[] {
    const regex = new RegExp(`(.|[\r\n]){1,${maxLength}}`, 'g');
    return text.match(regex) || [];
}

export async function createAndStoreEmbeddings(text: string, metadata: any) {
    const maxLength = 384; // Ajusta este valor según sea necesario
    const textChunks = splitText(text, maxLength);

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

    const { data, error } = await supabaseClient.from("embeddings").insert([{
        content: text,
        embedding: averagedEmbedding,
        metadata: metadata
    }]);

    if (error) {
        console.error('Error storing embeddings:', error);
        throw new Error('Failed to store embeddings');
    }

    return data;
}