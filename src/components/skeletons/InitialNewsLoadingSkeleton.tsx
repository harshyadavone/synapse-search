import { Image01Icon } from "../ui/icons";
import { NewsCardSkeleton } from "./NewsCardSkeleton";

export const InitialLoadingSkeleton: React.FC = () => (
    <div className="mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 md:px-4">
        <div className="h-96 md:h-auto bg-card rounded-xl">
          <div className="w-full h-full bg-card flex items-center justify-center rounded-lg">
            <Image01Icon
              className="text-muted-foreground/30"
              height={40}
              width={40}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start">
              <div className="w-full h-24 animate-pulse bg-card rounded-xl md:mr-4"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="news-grid md:p-4 md:mr-2">
        <NewsCardSkeleton />
      </div>
    </div>
  );