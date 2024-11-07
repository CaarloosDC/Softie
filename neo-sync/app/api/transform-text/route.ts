import { OpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

// Initialize OpenAI with environment variable
const llm = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Make sure this is set in .env.local
  temperature: 0.7,
  modelName: "gpt-3.5-turbo",  // Changed from gpt-3.5-turbo-instruct
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { text, prompt } = body;

    // Validate inputs
    if (!text || !prompt) {
      return NextResponse.json(
        { error: "Text and prompt are required" },
        { status: 400 }
      );
    }

    // Create the system prompt
    const systemPrompt = `
      Transform the following text according to this instruction: "${prompt}"
      Maintain the same language as the original text (Spanish or English).
      Keep the same basic meaning but adjust according to the instruction.
      Return only the transformed text without any additional formatting or prefixes.

      Original text: "${text}"
    `;

    try {
      // Get completion from OpenAI
      const transformedText = await llm.invoke(systemPrompt);

      // Validate response
      if (!transformedText) {
        throw new Error("No response from OpenAI");
      }

      // Clean up the response
      const cleanedText = transformedText
        .trim()
        .replace(/^["']|["']$/g, '')  // Remove quotes
        .replace(/^Transformed text:?\s*/i, ''); // Remove any prefix

      // Return the response
      return NextResponse.json({
        transformedText: cleanedText,
        success: true
      });

    } catch (openAiError) {
      console.error("OpenAI API Error:", openAiError);
      return NextResponse.json(
        { error: "OpenAI API error", details: (openAiError as Error).message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}