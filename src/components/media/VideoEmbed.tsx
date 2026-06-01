import { parseVideoUrl } from "@/lib/video";

interface VideoEmbedProps {
  url: string | undefined;
  title?: string;
  className?: string;
}

/**
 * Renders a responsive 16:9 video player.
 * Only whitelisted providers (YouTube/Vimeo/direct file) are ever embedded;
 * anything else renders nothing, so untrusted URLs cannot inject an iframe.
 */
export function VideoEmbed({ url, title, className = "" }: VideoEmbedProps) {
  const info = parseVideoUrl(url);
  if (!info) return null;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-stone-200/80 ${className}`}
    >
      {info.provider === "file" ? (
        <video
          src={info.fileUrl}
          controls
          playsInline
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <iframe
          src={info.embedUrl}
          title={title || "Video player"}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
}
