import { NextApiRequest, NextApiResponse } from "next";
import { retrieveRelevantDocs } from "@/lib/ollama/retrieval/retrieveRelevantDocs";
import { generateAnswer } from "@/lib/ollama/retrieval/generateLlamaResponse";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { query, jsonFormat, additionalData } = req.body;

    try {
        const docs = await retrieveRelevantDocs(query);
        const context = docs.map((doc: { content: any; }) => doc.content).join('\n');
        const response = await generateAnswer(query, context, jsonFormat, additionalData);

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: "Error generating AI Response", error });
    }
}