import { AnimatePresence, motion } from "framer-motion";
import { WikipediaData} from "./PersonalDetails";
import { Book, ExternalLink } from "lucide-react";
import Link from "next/link";

const WikipediaCard: React.FC<{
wikiData: WikipediaData;
randomColor: string;
toggleWikiExpanded: () => void;
wikiExpanded: boolean;
}> = ({ wikiData, randomColor, toggleWikiExpanded, wikiExpanded }) => (
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className={`rounded-2xl bg-gradient-to-t from-card to-transparent border border-opacity-5 border-card shadow-md shadow-${randomColor} hover:bg-muted/40 transition duration-150 mt-6 cursor-pointer`}
    onClick={toggleWikiExpanded}
>
    <div className="p-5">
    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
        <Book className="mr-2 text-indigo-500" />
        Wikipedia Information
    </h3>
    <AnimatePresence>
        {wikiExpanded && (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="grid gap-2 md:grid-cols-3">
            <div className="md:col-span-2">
                <div className="p-4">
                <p className="text-sm text-card-foreground/85 mb-4">
                    {wikiData.extract}
                </p>
                <span className="text-sm font-medium text-muted-foreground mb-2 line-clamp-2">
                    {wikiData.description}
                </span>
                {wikiData.url && (
                    <Link
                    href={wikiData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center"
                    >
                    <ExternalLink size={16} className="mr-1" />
                    Read more on Wikipedia
                    </Link>
                )}
                </div>
            </div>
            {wikiData.thumbnail && (
                <img
                src={wikiData.thumbnail.source || "/article-image.jpg"}
                alt="Wikipedia"
                className="object-cover w-full h-80 rounded-lg shadow-md transition-transform transform hover:opacity-80"
                />
            )}
            </div>
        </motion.div>
        )}
    </AnimatePresence>
    </div>
</motion.div>
);
export default WikipediaCard;