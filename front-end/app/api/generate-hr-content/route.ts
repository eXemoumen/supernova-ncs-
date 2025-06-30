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

    const systemPrompt = `You are an AI HR Assistant for OmniDesk. Your task is to generate creative and relevant HR content based on the user's prompt and provided context.\n    Consider the following:\n    - Client: ${client || "Not specified"}\n    - Niche: ${niche || "Not specified"}\n    - HR Brief: ${brief || "No specific brief provided."}\n\n    Generate 3-5 distinct HR content pieces (e.g., policy drafts, job descriptions, performance review templates). Present them as a numbered list, like this:\n1. HR Content One\n2. HR Content Two\n3. HR Content Three`;

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
          parts: [{ text: "Understood. I will generate HR content based on the provided information." }],
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
    console.log("Gemini raw response for HR content:", text);

    return NextResponse.json({ hrContent: text });
  } catch (error) {
    console.error("Gemini HR Content Generation API error:", error);
    return NextResponse.json({ error: "Failed to generate HR content from Gemini API" }, { status: 500 });
  }
}