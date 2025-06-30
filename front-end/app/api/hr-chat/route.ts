import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, context, client, niche } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using gemini-1.5-pro for consistency

    const systemPrompt = `You are an AI HR Assistant for OmniDesk. Your goal is to provide insightful and actionable advice on employee management, recruitment, and performance tracking.\n    Consider the following context for your responses:\n    - Client: ${client || "Not specified"}\n    - Niche: ${niche || "Not specified"}\n    - HR Brief: ${context || "No specific brief provided."}\n\n    Always be professional, concise, and helpful. Focus on HR policies, employee relations, recruitment strategies, and performance management.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to assist with HR management." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Gemini HR Chat API error:", error);
    return NextResponse.json({ error: "Failed to get response from Gemini API" }, { status: 500 });
  }
}