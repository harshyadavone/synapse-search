import { NextRequest, NextResponse } from "next/server";
import { ChatCohere } from "@langchain/cohere";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import { scrapeWebsite, splitAndProcessContent } from "@/lib/utils";
import { LangChainAdapter } from "ai";

// Environment variable validation
const envSchema = z.object({
  NEXT_PUBLIC_COHERE_API_KEY: z.string().min(1),
});

const env = envSchema.parse(process.env);

// Initialize the Cohere model
const model = new ChatCohere({
  model: "command-nightly",
  apiKey: env.NEXT_PUBLIC_COHERE_API_KEY,
  temperature: 0.3,
  streaming: true,
});

const inputSchema = z.object({
  urls: z.array(z.string().url()).min(1),
  prompt: z.string().min(1),
});

const promptTemplate = PromptTemplate.fromTemplate(`
  You are a knowledgeable AI assistant with expertise in various topics. 
  Using the information provided, respond to the following prompt. 
  Provide a clear, concise, and informative response as if you inherently know this information.
  
  Make sure to include the relevant context and information from the provided URLs.
  If the URLs are not relevant, respond with a neutral or informative message.
  
  Formatting and Structure Instructions (Do not change):
  1.a Prioritize tables and visuals over text.
  1.b Use proper Markdown syntax for better readability and structure.
  2. Start with a # (h1) title that succinctly captures the main topic.
  3. Follow with a brief introduction paragraph that sets the context.
  4. Use ## (h2) for major section headings to divide your content logically.
  5. Use ### (h3) for subsections, and #### (h4) for further divisions if necessary.
  6. Maintain a clear hierarchy in your headings. Don't skip levels.
  7. Use bullet points or numbered lists for easy readability where appropriate.
  8. Format tables properly using | for columns and - for the header separator.
  9. Use **bold** for emphasis on important terms or phrases.
  10. Use \`code blocks\` for any technical terms, commands, or code snippets.
  11. End with a brief conclusion or summary paragraph.

  Content and Style Guidelines:
  1. Write in a clear, professional, and engaging tone.
  2. Use concrete examples or analogies to illustrate complex concepts.
  3. Break down information into digestible chunks.
  4. Include relevant facts, figures, or statistics when applicable.
  5. Address potential questions or counterpoints proactively.
  6. Use transition phrases between sections for smooth flow.
  7. Aim for a balance between depth of information and conciseness.
  8. Incorporate metaphors or vivid language to make explanations more memorable.
  9. If appropriate, include a "Key Takeaways" or "Summary" section at the end.
  10. Use a conversational tone and avoid jargon or technical terms.

  Remember:
  - Do not refer to 'the content' or 'the article' in your response.
  - Write as if you inherently know this information.
  - Aim for a clean, professional UI/UX in your response structure.
  - Ensure your response is coherent, well-structured, and easy to follow.
  
  Information:
  {context}
  
  Prompt: {prompt}
  
  Response:
  `);

const chain = RunnableSequence.from([
  {
    context: (input: { context: string; prompt: string }) => input.context,
    prompt: (input: { context: string; prompt: string }) => input.prompt,
  },
  promptTemplate,
  model,
]);

export async function POST(req: NextRequest) {
  try {
    const startTime = Date.now();
    const body = await req.json();
    const { urls, prompt } = inputSchema.parse(body);

    // console.log(`Received ${urls.length} URLs and prompt: ${prompt}`);

    const scrapingResults = await Promise.all(
      urls.slice(0, 5).map(async (url) => {
        try {
          // console.time(`Scraping ${url}`);
          const content = await scrapeWebsite(url);
          // console.timeEnd(`Scraping ${url}`);
          return content;
        } catch (error) {
          // console.error(`Error scraping ${url}:`, error);
          return null;
        }
      })
    );

    const nonEmptyContents = scrapingResults.filter(
      (content): content is string => content !== null && content.length > 0
    );

    if (nonEmptyContents.length === 0) {
      throw new Error("No content could be scraped from the provided URLs");
    }

    // console.log(`Scraped ${nonEmptyContents.length} non-empty contents`);

    // console.time("Processing documents");
    const processedDocs = await Promise.all(
      nonEmptyContents.map(splitAndProcessContent)
    );
    // console.timeEnd("Processing documents");

    const allDocs = processedDocs.flat();

    const maxChunks = 20;
    const limitedDocs = allDocs.slice(0, maxChunks);

    // console.log(`Limited to ${limitedDocs.length} chunks`);

    // console.time("Generating response");
    const stream = await chain.stream({
      context: limitedDocs.map((doc) => doc.pageContent).join("\n\n"),
      prompt: prompt,
    });
    // console.timeEnd("Generating response");

    const endTime = Date.now();
    // console.log(`Total execution time: ${endTime - startTime}ms`);

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    // console.error("Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
