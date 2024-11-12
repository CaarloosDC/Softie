import { NextApiRequest, NextApiResponse } from "next";
import { estimateRequirementEffort } from "@/app/services/aiEstimationReq";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { nombre, descripcion, tipo } = req.body;

        try {
            const estimation = await estimateRequirementEffort( { nombre, descripcion, tipo } );
            res.status(200).json( estimation );
        } catch (error) {
            console.error('Error generating time estimation:', error);
            res.status(500).json({ message: "Error generating time estimation", error });
        } 
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}