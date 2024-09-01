import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as cheerio from "cheerio";
import { LRUCache } from "lru-cache";
import { Document } from "langchain/document";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const contentCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour TTL
});

class ScrapingError extends Error {
  constructor(message: string, public url: string) {
    super(message);
    this.name = "ScrapingError";
  }
}

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 OPR/90.0.4480.84",
];

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const cachedContent = contentCache.get(url);
    if (cachedContent) return cachedContent;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const randomIndex = Math.floor(Math.random() * userAgents.length);
    const userAgent = userAgents[randomIndex];

    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok)
      throw new ScrapingError(`HTTP error! status: ${response.status}`, url);

    const html = await response.text();
    const $ = cheerio.load(html);

    $(
      "script, style, nav, header, footer, iframe, [role=banner], [role=navigation], .ads, #ads, .advertisement"
    ).remove();

    const mainContent = $(
      "main, article, #content, .content, [role=main]"
    ).first();
    const content = (mainContent.length ? mainContent : $("body"))
      .text()
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    if (content.length < 100) {
      // console.warn(`Warning: Very little content scraped from ${url}`);
      return content; // Return without caching
    }

    contentCache.set(url, content);
    return content;
  } catch (error: any) {
    if (error instanceof ScrapingError) throw error;
    if (error.name === "AbortError") {
      throw new ScrapingError(`Timeout while scraping ${url}`, url);
    }
    throw new ScrapingError(
      `Error scraping ${url}: ${(error as Error).message}`,
      url
    );
  }
}

// Pre-compile regex patterns
const sentenceEndRegex = /[.!?]\s+/;
const whitespaceRegex = /\s+/;

export function splitAndProcessContent(content: string): Document[] {
  const chunkSize = 1000;
  const chunkOverlap = 200;
  const documents: Document[] = [];

  // Normalize whitespace
  const normalizedContent = content.replace(whitespaceRegex, " ").trim();

  // Split into sentences
  const sentences = normalizedContent.split(sentenceEndRegex);

  let currentChunk = "";
  let currentIndex = 0;

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length + 1 > chunkSize) {
      // Add current chunk to documents
      documents.push(
        new Document({
          pageContent: currentChunk.trim(),
          metadata: { index: currentIndex },
        })
      );

      // Start new chunk with overlap
      const overlapStart = Math.max(0, currentChunk.length - chunkOverlap);
      currentChunk = currentChunk.slice(overlapStart) + " " + sentence;
      currentIndex++;
    } else {
      // Add sentence to current chunk
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }

  // Add the last chunk if it's not empty
  if (currentChunk.trim()) {
    documents.push(
      new Document({
        pageContent: currentChunk.trim(),
        metadata: { index: currentIndex },
      })
    );
  }

  return documents;
}
