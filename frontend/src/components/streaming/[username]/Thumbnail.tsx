import { LiveBadge } from "@/components/live-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";

interface ThumbnailProps {
  isLive: boolean;
  src: string | null;
  fallback: string;
  username: string;
}
const Thumbnail = ({
  isLive = false,
  src,
  fallback,
  username,
}: ThumbnailProps) => {
  let content;
  console.log(isLive);
  if (!src) {
    content = (
      <div className="bg-background flex flex-col items-center gap-y-4 justify-center h-full w-full transition-transform group-hover:translate-x-2 group-hover:-transalte-y-2 rounded-md">
        <UserAvatar
          showBadge
          username={username}
          imageUrl={fallback}
          isLive={isLive}
        />
      </div>
    );
  } else {
    content = (
      <img
        src={src}
        className="group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md object-cover transition-transform"
        alt="Thumbnail"
      />
    );
  }
  return (
    <div className="group aspect-video relative rounded-md cursor-pointer">
      <div className="bg-blue-600 opacity-0 rounded-md absolute inset-0 transition-opacity flex items-center justify-center group-hover:opacity-100" />
      {content}

      {isLive && src && (
        <div className="absolute top-2 left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

export default Thumbnail;

export const ThumbnailSkeleton = () => {
  return (
    <div className="group aspect-video relative rounded-xl cursor-pointer">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
