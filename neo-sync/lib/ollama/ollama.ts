import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

const getHuggingFaceEmbeddings = () =>
  class HuggingFaceEmbeddingSingleton {
    // Choose this instead if your machine can run it on large documents
    // static model = 'Xenova/gte-base'; // Output: 768 dimensions
    static model = 'Xenova/all-MiniLM-L6-v2'; // Output: 384 dimensions

    static instance: HuggingFaceTransformersEmbeddings | null = null;

    static async getInstance() {
      if (this.instance === null) {
        this.instance = new HuggingFaceTransformersEmbeddings({
          modelName: this.model,
        });
      }
      return this.instance;
    }
  };

export type THuggingFaceEmbeddingSingleton = ReturnType<typeof getHuggingFaceEmbeddings>;

let HuggingFaceEmbeddingSingleton: THuggingFaceEmbeddingSingleton;

if (process.env.NODE_ENV !== 'production') {
  if (!window.HuggingFaceEmbeddingSingleton) {
    window.HuggingFaceEmbeddingSingleton = getHuggingFaceEmbeddings();
  }
  HuggingFaceEmbeddingSingleton = window.HuggingFaceEmbeddingSingleton;
} else {
  HuggingFaceEmbeddingSingleton = getHuggingFaceEmbeddings();
}

export default HuggingFaceEmbeddingSingleton;