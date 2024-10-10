const pdf = require('pdf-parse');
import { supabaseClient } from '@/supabase/client';
import { RecursiveCharacterTextSplitter, TextSplitter } from 'langchain/text_splitter'

export async function fetchAndParsePDF(filePath: string) {
    const { data: fileData, error: fileError } = await supabaseClient.storage.from('pdfs').download(filePath);

    if (fileError) {
        console.error('Error fetching file:', fileError);
        throw new Error('Error fetching file');
    }

    if (fileData) {
        const buffer = await fileData.arrayBuffer(); // Convert Blob to ArrayBuffer
        const parsedPDF = await pdf(Buffer.from(buffer));
        return parsedPDF.text;
    }

    throw new Error('No data found');
}