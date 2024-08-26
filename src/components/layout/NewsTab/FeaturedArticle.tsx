import ImageLoader from "@/components/ui/ImageLoader";
import { Article } from "@/hooks/useNews";

const FeaturedArticle: React.FC<{ article: Article }> = ({ article }) => (
  <a
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block group"
    aria-label={`Read more about ${article.title}`}
  >
    <div className="relative h-96 overflow-hidden md:rounded-xl">
      <ImageLoader
        src={article.urlToImage || "/article-image.jpg"}
        alt={article.title}
        className="object-cover w-full h-full transition-transform duration-300 opacity-60 group-hover:opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-background">
        <h2 className="text-3xl text-card-foreground font-bold mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-sm mb-2 text-card-foreground line-clamp-3">
          {article.description}
        </p>
        <span className="text-xs text-card-foreground opacity-75">
          {article.source.name} •{" "}
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  </a>
);

export default FeaturedArticle;
