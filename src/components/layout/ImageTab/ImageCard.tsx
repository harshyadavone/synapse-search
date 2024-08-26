import { ImageSearchResult } from "@/types";
import { useEffect, useState } from "react";

const ImageCard = ({
  item,
  isMobile,
}: {
  item: ImageSearchResult;
  isMobile: boolean;
}) => {
  const [imageSrc, setImageSrc] = useState(item.thumbnailLink);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = item.link;
    img.onload = () => {
      setImageSrc(item.link);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setError(true);
    };
  }, [item.link]);

  return (
    <div
      className={`overflow-hidden ${
        isMobile ? "rounded-md" : "rounded-lg shadow-md"
      } hover:shadow-lg transition-shadow duration-300`}
    >
      <a
        href={item.contextLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative bg-card">
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent skeleton-loading"></div>
          )}
          {!error ? (
            <img
              src={imageSrc}
              alt={item.title}
              className={`w-full h-auto transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <div className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-card text-muted-foreground">
              Image unavailable
            </div>
          )}
        </div>
        <div className={`${isMobile ? "p-2" : "p-3"}`}>
          <h3 className="font-semibold text-xs sm:text-sm mb-1 truncate text-foreground">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground">{item.displayLink}</p>
        </div>
      </a>
    </div>
  );
};

export default ImageCard;
