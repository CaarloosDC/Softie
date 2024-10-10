import { supabaseClient } from "@/supabase/client";
import { OllamaEmbeddings } from "@langchain/ollama";

export async function retrieveRelevantDocs(query: string) {
  // Initialize Ollama Embeddings
  const ollamaEmbeddings = new OllamaEmbeddings({ model: 'llama-3.1' });

  // Generate embeddings for the query
  const queryEmbedding = await ollamaEmbeddings.embedQuery(query);

  // Perform similarity search in Supabase using pgvector
  const { data, error } = await supabaseClient.rpc('match_documents', {
    query_embedding: queryEmbedding,
    similarity_threshold: 0.7,  // Customize the threshold for relevance
    match_count: 5  // Limit to top 5 matches
  });

  if (error) {
    console.error('Error retrieving relevant documents:', error);
    throw new Error('Failed to retrieve relevant documents');
  }

  return data;
}