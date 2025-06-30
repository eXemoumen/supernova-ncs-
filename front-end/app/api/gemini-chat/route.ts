import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { message, context, clientId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let clientName = "Not specified";
    let clientNiche = "Not specified";
    let clientIndustry = "Not specified";
    let clientNotes = "No specific notes provided.";

    if (clientId) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error("Error fetching client data:", clientError);
      } else if (clientData) {
        clientName = clientData.name || clientName;
        clientNiche = clientData.niche || clientNiche;
        clientIndustry = clientData.industry || clientIndustry;
        clientNotes = clientData.notes || clientNotes;
      }
    }

    const systemPrompt = `You are an AI Marketing Strategist for OmniDesk. Your goal is to provide insightful and actionable marketing advice.\n    Consider the following context for your responses:\n    - Client Name: ${clientName}\n    - Client Niche: ${clientNiche}\n    - Client Industry: ${clientIndustry}\n    - Client Notes: ${clientNotes}\n    - Marketing Brief: ${context || "No specific brief provided."}\n\n    Always be professional, concise, and helpful. Focus on marketing strategies, campaign ideas, content suggestions, and performance analysis.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to assist with marketing strategies." }],
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
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to get response from Gemini API" }, { status: 500 });
  }
}
