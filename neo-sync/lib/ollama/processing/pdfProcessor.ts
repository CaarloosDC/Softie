import type { Document } from "langchain/document";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

type TMetadata = {
    title: string;
    fileType: string;
    totalPages: number;
    roomKeys: {
        [key: string]: boolean;
    };
};

// Se exporta el tipo de dato, se omite el atributo totalPages y se agrega el atributo splitNumber
export type TChunkMetaData = Omit<TMetadata, "totalPages"> & { splitNumber: number };

type TProcessedDocument = Document<TMetadata>;

export type TProcessedChunk = Document<TChunkMetaData>;
;

/**
 *
 * @param files An array of `File` instances, one for each PDF file uploaded.
 * @param roomId The room to grant initial access to for these files.
 * @returns An array of `Document` instances, one for each PDF file. We will
 *   generate one array of `Document` instances per `File` instance.
 */
export const processPDFFiles: (
  files: Array<File>,
  roomId: string
) => Promise<TProcessedDocument[][]> = async (files, roomId) => {
  return await Promise.all(
    files.map((file) =>
      new PDFLoader(file, { splitPages: file.size > 500_000 }).load().then((docs) => {
        return docs.map((doc) => ({
          ...doc,
          metadata: {
            title: file.name,
            fileType: file.type,
            totalPages: doc['metadata']['pdf']['totalPages'],
            roomKeys: {
              [roomId]: true,
            },
          },
        }));
      })
    )
  );
};

/**
 *
 * @param documents A nested array of `Document` instances 
 * @returns A nested array of chunks, one for each source file,
 *   with each chunk containing metadata about their source file.
 */
export const getTextChunks: (
  documents: Array<Array<Document>>
) => Promise<Array<Array<TProcessedChunk>>> = async (files) => {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const splits = await Promise.all(
    files.map((pages) =>
      // 2D Array of splits
      Promise.all(
        pages.map(
          (page) =>
            splitter.splitDocuments([page]).then((splits) =>
              splits.map((split) => ({
                ...split,
                metadata: {
                  title: page.metadata.title,
                  fileType: page.metadata.fileType,
                  roomKeys: page.metadata.roomKeys,
                },
              }))
            )
          // 1D Array of splits
        )
      ).then((res) =>
        res
          .flatMap((pageSplits) => pageSplits)
          .map((split, splitIndex) => ({
            ...split,
            metadata: { ...split.metadata, splitNumber: splitIndex + 1 },
          }))
      )
    )
  );
  return splits;
};