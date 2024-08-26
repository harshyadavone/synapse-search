import { Hcard, WebSearchResult } from "@/types";
import { motion } from "framer-motion";
import { Cake, ExternalLink, Globe, User } from "lucide-react";
import Link from "next/link";

const AdditionalInfoCard: React.FC<{
  combinedInfo: Hcard;
  additionalInfo: Partial<WebSearchResult>;
  randomColor: string;
}> = ({ combinedInfo, additionalInfo, randomColor }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className={`rounded-2xl p-4 bg-gradient-to-t from-card to-transparent border border-opacity-5 border-card shadow-md shadow-${randomColor} hover:bg-muted/80 transition-colors duration-150`}
  >
    {additionalInfo.description && (
      <p className="text-sm mb-3 text-card-foreground/85 line-clamp-6">
        {additionalInfo.description}
      </p>
    )}
    {additionalInfo.author && (
      <p className="flex items-center text-sm mb-2">
        <User size={16} className="inline mr-2 text-indigo-500" />
        <span className="text-card-foreground/85 line-clamp-1">
          Author: {additionalInfo.author}
        </span>
      </p>
    )}
    {additionalInfo.datePublished && (
      <p className="text-sm mb-2">
        <Cake size={16} className="inline mr-2 text-indigo-500" />
        <span className="text-card-foreground/85">
          Published: {additionalInfo.datePublished}
        </span>
      </p>
    )}
    {additionalInfo.site_name && (
      <p className="text-sm mb-2">
        <Globe size={16} className="inline mr-2 text-indigo-500" />
        <span className="text-card-foreground/85">
          Site: {additionalInfo.site_name}
        </span>
      </p>
    )}
    {combinedInfo.url && (
      <p className="text-sm">
        <ExternalLink size={16} className="inline mr-2 text-indigo-500" />
        <Link
          href={
            combinedInfo.url.startsWith("http://") ||
            combinedInfo.url.startsWith("https://")
              ? combinedInfo.url
              : `https://${combinedInfo.url}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {combinedInfo.url_text || "Visit Website"}
        </Link>
      </p>
    )}
    {!additionalInfo.description &&
      !additionalInfo.author &&
      !additionalInfo.datePublished &&
      !additionalInfo.site_name &&
      !combinedInfo.url && (
        <p className="text-sm text-muted-foreground">
          No additional information available.
        </p>
      )}
  </motion.div>
);

export default AdditionalInfoCard;
