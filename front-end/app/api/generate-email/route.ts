import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // In a real application, you would use a generative AI model here.
    // For this example, we'll simulate a response.
    const subject = `AI-Generated Subject for: ${prompt}`;
    const body = `This is an AI-generated email body based on the prompt: "${prompt}". You can edit this text before sending.`;

    return NextResponse.json({ subject, body });
  } catch (error) {
    console.error("Error generating email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
