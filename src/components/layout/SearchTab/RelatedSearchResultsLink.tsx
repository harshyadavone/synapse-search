import { WebSearchResult } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

const RelatedSearchResultsLink: React.FC<{
  item: WebSearchResult;
  randomColor: string;
  index: number;
}> = ({ item, index, randomColor }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 + index * 0.05 }}
    className={`flex-shrink-0 w-[280px] sm:w-[300px] rounded-2xl p-4 bg-gradient-to-t from-card to-transparent border border-opacity-5 border-card shadow-lg shadow-${randomColor} hover:bg-muted/80 transition-colors duration-150`}
  >
    <Link
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-1">
        <img
          src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.link}&size=32`}
          alt={item.title}
          className="h-5 w-5 rounded-full p-0.5"
        />
        <span className="text-sm text-muted-foreground/80">
          {item.site_name || item.displayLink}
        </span>
      </div>
      <span className="text-sm font-medium line-clamp-2 text-primary">
        {item.title}
      </span>
      <p className="text-sm mt-1 line-clamp-3 text-card-foreground/85">
        {item.snippet}
      </p>
    </Link>
  </motion.div>
);

export default RelatedSearchResultsLink;
