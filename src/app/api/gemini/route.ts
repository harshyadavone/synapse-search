import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import { GEMINI_API_KEY } from "@/config";

export const runtime = "edge";

const requestSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = requestSchema.parse(body);

    const enhancedPrompt = `
    Please provide a comprehensive answer to the query: "${prompt}".
    
    When referencing a source, use the title of the source as a clickable link. For example:
    - [Title of the Source](https://example.com)
    
    Ensure that the source names are displayed clearly and avoid using generic terms like "Source". Use the exact name or title of the source as it appears in the results and don't add sources in tables and other data like code.
    `;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContentStream(enhancedPrompt);

    // Convert the response to a ReadableStream
    const stream = GoogleGenerativeAIStream(result);

    // Return the stream as a StreamingTextResponse
    return new StreamingTextResponse(stream);
  } catch (error) {
    // console.error("Detailed error in Gemini API:", error);
    if (error instanceof Error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
    return new Response("Unknown error occurred", { status: 500 });
  }
}
