import { useState, useCallback, useEffect } from "react";

interface YouTubeItem {
  id: string;
  title: string;
  caption?: string;
}

interface Props {
  items: YouTubeItem[];
}

/**
 * Carousel gallery for YouTube videos with left/right navigation.
 * Supports keyboard nav (←/→). Embeds are responsive 16:9.
 */
export default function YouTubeGallery({ items }: Props) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (!items.length) return null;
  const current = items[index];

  return (
    <figure className="my-8">
      <div className="relative group">
        {/* YouTube embed */}
        <div className="relative overflow-hidden rounded-lg border border-border aspect-video">
          <iframe
            key={current.id}
            src={`https://www.youtube.com/embed/${current.id}`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <NavButton dir="left" onClick={prev} />
            <NavButton dir="right" onClick={next} />
          </>
        )}
      </div>

      {/* Caption + counter */}
      <div className="text-center mt-3">
        {items.length > 1 && (
          <div className="font-mono text-[0.7rem] text-text-tertiary tracking-[0.1em] mb-1">
            {index + 1} / {items.length}
          </div>
        )}
        {current.caption && (
          <figcaption className="text-sm text-text-tertiary font-light">
            {current.caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

function NavButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = dir === "left";
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? "left-2" : "right-2"} opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer`}
      aria-label={isLeft ? "Previous" : "Next"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline
          points={isLeft ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}
        />
      </svg>
    </button>
  );
}
