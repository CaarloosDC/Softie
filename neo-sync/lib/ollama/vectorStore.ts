import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import HuggingFaceEmbeddingSingleton from "./ollama";
import { supabaseClient } from "@/supabase/client";

const getVectorStore = () =>
  class VectorStoreSingleton {
    static instance: SupabaseVectorStore | null = null;
    static async getInstance() {
      if (this.instance === null) {
        const embeddings = await HuggingFaceEmbeddingSingleton.getInstance();
        this.instance = await new SupabaseVectorStore(embeddings,
          {
            client: supabaseClient,
            tableName: "embeddings",
            queryName: "match_documents"
          });
        // Initialise cleanup on initial
        process.on('beforeExit', () => {
          // this.instance?.end();
          this.instance = null;
        });
      }
      return this.instance;
    }
  };

  export type TVectorStore = ReturnType<typeof getVectorStore>;

let VectorStore: TVectorStore;

if (process.env.NODE_ENV !== 'production') {
  if (!window.VectorStoreSingleton) {
    window.VectorStoreSingleton = getVectorStore();
  }
  VectorStore = window.VectorStoreSingleton;
} else {
  VectorStore = getVectorStore();
}
