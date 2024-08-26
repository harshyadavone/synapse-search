import { motion } from "framer-motion";
import ImageLoader from "@/components/ui/ImageLoader";
import { WebSearchResult } from "@/types";
import { Image01Icon } from "@/components/ui/icons";
import dynamic from "next/dynamic";
import Link from "next/link";

const Calendar = dynamic(() =>
  import("lucide-react").then((mod) => mod.Calendar)
);
const User = dynamic(() => import("lucide-react").then((mod) => mod.User));
const Globe = dynamic(() => import("lucide-react").then((mod) => mod.Globe));

const SearchResultItem: React.FC<{
  result: WebSearchResult;
  index: number;
}> = ({ result, index }) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ delay: index * 0.1 }}
    className="group pb-4 rounded-lg overflow-hidden w-full max-w-4xl p-3"
  >
    <div className="flex flex-col sm:flex-row items-start pb-2">
      <div className="w-full sm:w-40 h-40 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 rounded-md overflow-hidden group-hover:opacity-90 transition-opacity duration-300">
        {result.thumbnailUrl ? (
          <ImageLoader
            src={result.thumbnailUrl || `` || ""}
            alt={`Thumbnail for ${result.title}`}
            className="w-full h-full object-cover"
            loadingClassName="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Image01Icon className="text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-grow w-full">
        <Link
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <h3 className="text-lg sm:text-xl font-medium text-primary leading-tight hover:underline underline-offset-1 line-clamp-1">
            <span dangerouslySetInnerHTML={{ __html: result.htmlTitle }} />
          </h3>
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={result.formattedUrl}
          className="text-sm text-muted-foreground flex items-center mt-2 hover:text-foreground"
        >
          <img
            rel="preconnect"
            src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${result.link}&size=32`}
            alt=""
            className="w-4 h-4 mr-2"
            loading="lazy"
          />
          {result.displayLink}
        </Link>
        <p
          className={`text-sm sm:text-base mt-3 text-card-foreground leading-relaxed ${
            result.description ? "line-clamp-1" : "line-clamp-3"
          }`}
          dangerouslySetInnerHTML={{ __html: result.htmlSnippet }}
        />
        {result.description && (
          <p className="text-xs sm:text-sm mt-3 text-muted-foreground italic border-l-2 border-accent pl-3 line-clamp-2">
            {result.description}
          </p>
        )}
        <div className="text-xs text-muted-foreground mt-4 flex flex-wrap items-center">
          {result.datePublished && (
            <span className="mr-2 sm:mr-4 mb-2 sm:mb-0 bg-accent/20 px-2 sm:px-3 py-1 rounded-full flex items-center hover:bg-accent/30 transition-colors duration-300">
              <Calendar size={12} className="mr-1" />
              {result.datePublished}
            </span>
          )}
          {result.author && (
            <span className="mr-2 sm:mr-4 mb-2 sm:mb-0 bg-accent/20 px-2 sm:px-3 py-1 rounded-full flex items-center hover:bg-accent/30 transition-colors duration-300">
              <User size={12} className="mr-1" />
              {result.author}
            </span>
          )}
          {result.site_name && (
            <span className="mb-2 sm:mb-0 bg-accent/20 px-2 sm:px-3 py-1 rounded-full flex items-center hover:bg-accent/30 transition-colors duration-300">
              <Globe size={12} className="mr-1 " />
              {result.site_name}
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.li>
);

export default SearchResultItem;
