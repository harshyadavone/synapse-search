import ImageLoader from "@/components/ui/ImageLoader";
import { Article } from "@/hooks/useNews";
import Link from "next/link";

const CompactNewsCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center group"
    aria-label={`Read more about ${article.title}`}
  >
    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg mr-4">
      <ImageLoader
        src={article.urlToImage || "/placeholder-image.jpg"}
        alt={article.title}
        className="object-cover w-full h-full transition-transform duration-300 hover:opacity-80"
      />
    </div>
    <div>
      <h3 className="text-sm font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
        {article.title}
      </h3>
      <span className="text-xs text-muted-foreground">
        {article.source.name}
      </span>
    </div>
  </Link>
);

export default CompactNewsCard;
