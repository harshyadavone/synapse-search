import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://synapse-search.vercel.app";

  // Function to escape ampersands in URLs
  const escapeUrl = (url: string) => url.replace(/&/g, '&amp;');

  // List of example searches
  const exampleSearches = ["technology", "science", "programming", "AI"];

  // Main structure
  const mainStructure: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    },
    {
      url: escapeUrl(`${baseUrl}/results?type=aichat`),
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: escapeUrl(`${baseUrl}/results?type=image`),
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: escapeUrl(`${baseUrl}/results?type=video`),
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: escapeUrl(`${baseUrl}/results?type=news`),
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
  ];

  // Example searches
  const examplePages: MetadataRoute.Sitemap = exampleSearches.flatMap(
    (search) => [
      {
        url: escapeUrl(`${baseUrl}/results?q=${encodeURIComponent(search)}`),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      },
      {
        url: escapeUrl(`${baseUrl}/results?q=${encodeURIComponent(search)}&type=aichat`),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.6,
      },
    ]
  );

  return [...mainStructure, ...examplePages];
}