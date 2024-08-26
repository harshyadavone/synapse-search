import ImageLoader from "@/components/ui/ImageLoader";
import { VideoItem } from "@/hooks/useVideos";
import Link from "next/link";

const VideoCard: React.FC<{ video: VideoItem }> = ({ video }) => (
  <Link
    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
    target="_blank"
    rel="noopener noreferrer"
    className="group block"
  >
    <div className="aspect-w-16 h-48 w-full md:max-w-80 aspect-h-9 mb-2 overflow-hidden md:rounded-xl ">
      <ImageLoader
        src={
          video.snippet.thumbnails.high?.url ||
          video.snippet.thumbnails.medium?.url ||
          video.snippet.thumbnails.default?.url
        }
        alt={video.snippet.title}
        className="object-cover w-full h-full hover:opacity-70 transition-opacity duration-300 ease-in-out"
        loadingClassName="h-48 w-full"
      />
    </div>
    <h3 className="text-sm font-medium px-2 py-1 line-clamp-2 group-hover:text-primary transition-colors">
      {video.snippet.title}
    </h3>
    <p className="text-xs text-gray-500 px-2 mt-1">
      {video.snippet.channelTitle}
    </p>
  </Link>
);
export default VideoCard;