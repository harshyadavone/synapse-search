export const NewsCardSkeleton: React.FC = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="skeleton-card">
        <div className="h-48 skeleton-shimmer bg-card rounded-lg mb-4"></div>
        <div className="h-4 skeleton-shimmer bg-card rounded w-3/4 mb-2"></div>
        <div className="h-4 skeleton-shimmer bg-card rounded w-2/3"></div>
      </div>
    ))}
  </>
);
