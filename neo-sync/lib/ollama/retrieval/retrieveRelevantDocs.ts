import { supabase } from "@/lib/db";
import { ollamaEmbeddingClient } from "../client/ollamaEmbeddingClient";

export async function retrieveRelevantDocs(query: string) {

  // Generate embeddings for the query
  const queryEmbedding = await ollamaEmbeddingClient.embedQuery(query);

  // Perform similarity search in Supabase using pgvector
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    // similarity_threshold: 0.7,  // Customize the threshold for relevance
    match_count: 5, // Limit to top 5 matches,
    filter: {}
  });

  if (error) {
    console.error('Error retrieving relevant documents:', error);
    throw new Error('Failed to retrieve relevant documents');
  }

  return data;
}