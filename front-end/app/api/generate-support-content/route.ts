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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using gemini-1.5-pro for consistency

    const systemPrompt = `You are an AI Support Assistant for OmniDesk. Your task is to generate creative and relevant support content based on the user's prompt and provided context.\n    Consider the following:\n    - Client: ${client || "Not specified"}\n    - Niche: ${niche || "Not specified"}\n    - Support Brief: ${brief || "No specific brief provided."}\n\n    Generate 3-5 distinct support content pieces (e.g., customer responses, FAQ answers, knowledge base article outlines). Present them as a numbered list, like this:\n1. Support Content One\n2. Support Content Two\n3. Support Content Three`;

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
          parts: [{ text: "Understood. I will generate support content based on the provided information." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
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
    console.log("Gemini raw response for support content:", text);

    return NextResponse.json({ supportContent: text });
  } catch (error) {
    console.error("Gemini Support Content Generation API error:", error);
    return NextResponse.json({ error: "Failed to generate support content from Gemini API" }, { status: 500 });
  }
}