"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Image01Icon } from "./icons";

const ImageLoader: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
}> = ({ src, alt, className, loadingClassName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(`${src}?q=10&w=100`);

  const handleImageLoaded = useCallback(() => {
    setIsLoading(false);
    setImageSrc(src);
  }, [src]); // Include src in the dependency array

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = handleImageLoaded;
    img.onerror = handleImageError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, handleImageLoaded, handleImageError]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${loadingClassName}`}
    >
      {!hasError && (
        <img
          src={imageSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover duration-500 ${className}`}
          style={{
            transition: "all 0.5s",
            filter: isLoading ? "blur(10px)" : "none",
          }}
          loading="lazy"
        />
      )}
      {(isLoading || hasError) && (
        <div
          className="absolute inset-0 bg-card"
          style={{ backgroundSize: "200% 100%" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Image01Icon
              className="text-muted-foreground/30"
              height={40}
              width={40}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoader;
