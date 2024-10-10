import { OllamaEmbeddings } from "@langchain/ollama";
import { fetchAndParsePDF } from "./pdfParser";
import { supabaseClient } from "@/supabase/client";
import { metadata } from "@/app/layout";

export async function storePDFEmbeddings(filePath: string) {
    const pdfText = await fetchAndParsePDF(filePath);

    const ollamaEmbeddings = new OllamaEmbeddings({
        model: "mxbai-embed-large", // Default value
        baseUrl: "http://localhost:11434", // Default value
    });

    const embedding = await ollamaEmbeddings.embedQuery(pdfText);

    const { data, error } = await supabaseClient.from("embeddings").insert([{ content: pdfText, embedding: embedding, metadata: { type: 'pdf', filePath: filePath} }]);

    if (error) {
        console.error('Error storing PDF content and embeddings:', error);
        throw new Error('Failed to store PDF content and embeddings');
    }

    return data;
}