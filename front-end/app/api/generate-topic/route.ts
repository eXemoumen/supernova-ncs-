import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, client, niche, brief } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an AI Marketing Strategist for OmniDesk. Your task is to generate creative and relevant content topics based on the user's prompt and provided context.
    Consider the following:
    - Client: ${client || "Not specified"}
    - Niche: ${niche || "Not specified"}
    - Marketing Brief: ${brief || "No specific brief provided."}

    Generate a list of 5-10 distinct content topics. Present them as a numbered list, like this:
1. Topic One
2. Topic Two
3. Topic Three`;

    console.log("Prompt sent to Gemini:", prompt);
    console.log("System Prompt sent to Gemini:", systemPrompt);

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will generate content topics based on the provided information." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    let text = "";
    try {
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      text = await response.text();
      console.log("Text from Gemini before sending to frontend:", text);
    } catch (geminiError) {
      console.error("Error during Gemini sendMessage:", geminiError);
      return NextResponse.json({ error: "Failed to get response from Gemini API during sendMessage" }, { status: 500 });
    }
    console.log("Gemini raw response for topics:", text);

    return NextResponse.json({ topics: text });
  } catch (error) {
    console.error("Gemini Topic Generation API error:", error);
    return NextResponse.json({ error: "Failed to generate topics from Gemini API" }, { status: 500 });
  }
}