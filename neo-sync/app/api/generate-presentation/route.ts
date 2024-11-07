import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { projectInfo, requirements, proposalText } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a presentation expert. Generate a sales presentation structure in Spanish for a project proposal. 
          Return a JSON object with two properties:
          1. 'slides': array of slides, each with title, content, needsImage (boolean), and imageQuery (specific and detailed query for professional images)
          2. 'theme': object containing presentation styling (background, titleColor, bodyColor, textColor, titleSize, bodySize, fontFamily)
          
          Make the theme professional and matching the project's industry and tone.
          Make image queries very specific for professional, relevant images.`
        },
        {
          role: "user",
          content: `Create a compelling presentation for this project: ${JSON.stringify({ projectInfo, requirements, proposalText })}`
        }
      ]
    });

    const response = JSON.parse(completion.choices[0].message.content || '{"slides":[],"theme":{}}');
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json({ error: 'Failed to generate presentation' }, { status: 500 });
  }
}