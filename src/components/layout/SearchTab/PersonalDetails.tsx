import React, { useEffect, useState } from "react";
import { WebSearchResult, Hcard } from "@/types";
import { motion } from "framer-motion";
import {
  User,
} from "lucide-react";
import axios from "axios";
import PersonalCard from "./PersonalCard";
import AdditionalInfoCard from "./AdditionalInfoCard";
import WikipediaCard from "./WikipediaCard";
import { colors } from "@/lib/Colors";

export interface PersonalDetailsProps {
  searchData: WebSearchResult[];
}

export interface WikipediaData {
  extract: string;
  thumbnail?: { source: string };
  description?: string;
  url?: string;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ searchData }) => {
  const [wikiData, setWikiData] = useState<WikipediaData | null>(null);
  const [wikiExpanded, setWikiExpanded] = useState<boolean>(false);

  const hcardData: Hcard[] = searchData
    .map((result: WebSearchResult) => result.hcard)
    .filter((hcard): hcard is Hcard => hcard !== undefined);

  const combinedInfo: Hcard = hcardData.reduce(
    (acc: Hcard, curr: Hcard) => ({ ...acc, ...curr }),
    {}
  );

  useEffect(() => {
    const fetchWikipediaData = async () => {
      if (combinedInfo.fn) {
        try {
          const response = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              combinedInfo.fn
            )}`
          );
          setWikiData(response.data);
        } catch (error) {
          console.error("Error fetching Wikipedia data:", error);
        }
      }
    };

    fetchWikipediaData();
  }, [combinedInfo.fn]);

  const toggleWikiExpanded = () => {
    setWikiExpanded(!wikiExpanded);
  };

  if (hcardData.length === 0) return null;

  const image = searchData.reduce(
    (acc: string | undefined, curr: WebSearchResult) =>
      acc || curr.thumbnailUrl || curr.imageUrl || curr.metadata?.ogImage,
    undefined
  );

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const additionalInfo = searchData.reduce(
    (acc, curr) => ({
      ...acc,
      description: acc.description || curr.description,
      author: acc.author || curr.author,
      datePublished: acc.datePublished || curr.datePublished,
      site_name: acc.site_name || curr.site_name,
    }),
    {} as Partial<WebSearchResult>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 p-6 bg-${randomColor} w-full max-w-4xl mx-auto rounded-2xl bg-opacity-[0.02] border border-opacity-5 border-card shadow-lg`}
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center text-indigo-700">
        <User className="mr-3 text-indigo-500 h-8 w-8" />
        <span className="text-xl font-semibold text-indigo-600">
          Personal Details
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {hcardData !== undefined && (
          <PersonalCard
            combinedInfo={combinedInfo}
            image={image}
            randomColor={randomColor}
          />
        )}
        <AdditionalInfoCard
          combinedInfo={combinedInfo}
          additionalInfo={additionalInfo}
          randomColor={randomColor}
        />
      </div>
      {wikiData && (
        <WikipediaCard
          wikiData={wikiData}
          randomColor={randomColor}
          toggleWikiExpanded={toggleWikiExpanded}
          wikiExpanded={wikiExpanded}
        />
      )}
    </motion.div>
  );
};

export default PersonalDetails;