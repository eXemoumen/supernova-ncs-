import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { client, niche, brief } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an AI Marketing Strategist for OmniDesk. Your task is to generate marketing campaign ideas in a structured JSON format.\n    Consider the following context:\n    - Client: ${client || "Not specified"}\n    - Niche: ${niche || "Not specified"}\n    - Marketing Brief: ${brief || "No specific brief provided."}\n\n    Generate 3-5 distinct campaign ideas. Each campaign should have the following properties:
    - id: unique number
    - name: string (e.g., "Summer Sale 2024")
    - status: "active" | "draft" | "completed"
    - performance: number (0-100)
    - budget: string (e.g., "$5,000")
    - startDate: string (YYYY-MM-DD)
    - endDate: string (YYYY-MM-DD)
    - targetAudience: string
    - channels: string[] (e.g., ["Social Media", "Email"])
    - roi: number (Return on Investment percentage)
    - client: string (the client name provided)
    - niche: string (the niche provided)

    Respond only with the JSON array of campaigns, without any additional text or markdown formatting.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will generate campaign ideas in JSON format." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
      },
    });

    const result = await chat.sendMessage("Generate marketing campaign ideas.");
    const response = await result.response;
    const text = response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini Campaign Generation API error:", error);
    return NextResponse.json({ error: "Failed to generate campaigns from Gemini API" }, { status: 500 });
  }
}