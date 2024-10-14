import { storePDFEmbeddings } from "@/lib/ollama/processing/storePDFEmbeddings";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { filePath } = req.body;

    try {
        const response = await storePDFEmbeddings('rfc2119.pdf');
        res.status(200).json({ response });
    } catch (error) {
        console.error('Error generating embeddings:', error);
        res.status(500).json({ message: "Error generating embeddings", error: error });
    }
}