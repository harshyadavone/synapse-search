import ImageLoader from "@/components/ui/ImageLoader";
import { Article } from "@/hooks/useNews";

const NewsCard: React.FC<{ article: Article }> = ({ article }) => (
  <a
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block group"
    aria-label={`Read more about ${article.title}`}
  >
    <div className="h-48 overflow-hidden md:rounded-lg mt-2 mb-4">
      <ImageLoader
        src={article.urlToImage || "/placeholder-image.jpg"}
        alt={article.title}
        className="object-cover w-full h-full transition-transform duration-300 hover:opacity-80"
      />
    </div>
    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors px-2">
      {article.title}
    </h3>
    <p className="text-sm text-card-foreground/70 mb-2 line-clamp-2 px-2">
      {article.description}
    </p>
    <div className="flex justify-between text-xs text-muted-foreground px-2">
      <span>{article.source.name}</span>
      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
    </div>
  </a>
);

export default NewsCard;
