import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@lib/utils";

interface Props {
  /** Image source path */
  src: string;
  /** Image alt text */
  alt: string;
  /** Caption shown in lightbox (supports HTML). Falls back to alt. */
  caption?: string;
  /** Text column width out of 12 (e.g., 6 = 50%, 4 = 33%). Image gets the rest. Default: 6 */
  textSpan?: number;
  /** Place image on the left instead of right. Default: false */
  imageLeft?: boolean;
  /** Additional className for the wrapper */
  className?: string;
  children: ReactNode;
}

const spanClass: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
};

/**
 * Side-by-side text + image layout with configurable ratio.
 * Uses a 12-column grid. Stacks vertically on mobile.
 * Image is clickable and expands into a fullscreen lightbox.
 */
export default function TextImage({
  src,
  alt,
  caption,
  textSpan = 6,
  imageLeft = false,
  className,
  children,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const imageSpan = 12 - textSpan;

  const close = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [expanded, close]);

  const textCol = (
    <div className={cn(spanClass[textSpan], "flex flex-col justify-center")}>
      <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary leading-relaxed">
        {children}
      </div>
    </div>
  );

  const imageCol = (
    <div className={cn(spanClass[imageSpan], "flex flex-col items-center justify-center")}>
      <button
        onClick={() => setExpanded(true)}
        className="group relative w-full p-0 m-0 rounded-lg overflow-hidden border border-border hover:border-border-hover transition-colors cursor-pointer"
      >
        <img
          src={src}
          alt={alt}
          className="w-full block transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </button>
      {(caption || alt) && (
        <p className="mt-2 text-xs text-text-tertiary text-center w-full" dangerouslySetInnerHTML={{ __html: caption || alt }} />
      )}
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center",
          className
        )}
      >
        {imageLeft ? (
          <>
            {imageCol}
            {textCol}
          </>
        ) : (
          <>
            {textCol}
            {imageCol}
          </>
        )}
      </div>

      {expanded &&
        createPortal(
          <Lightbox src={src} alt={alt} caption={caption} onClose={close} />,
          document.body
        )}
    </>
  );
}

function Lightbox({ src, alt, caption, onClose }: { src: string; alt: string; caption?: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const clampScale = (s: number) => Math.min(Math.max(s, 0.5), 5);

  const zoomIn = useCallback(() => {
    setScale((s) => clampScale(s * 1.3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => clampScale(s / 1.3));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) => clampScale(s * (e.deltaY < 0 ? 1.1 : 0.9)));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "=" || e.key === "+") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, zoomIn, zoomOut, resetZoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Zoom controls */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
          <button onClick={zoomOut} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Zoom out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button onClick={resetZoom} className="px-2 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs font-mono flex items-center justify-center transition-colors cursor-pointer min-w-[3rem]" aria-label="Reset zoom">
            {Math.round(scale * 100)}%
          </button>
          <button onClick={zoomIn} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Zoom in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        <div
          className="max-w-[90vw] max-h-[85vh] select-none"
          style={{
            transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
            cursor: scale > 1 ? "grab" : "default",
            transition: dragging.current ? "none" : "transform 0.15s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <motion.img
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            draggable={false}
          />
        </div>

        {(caption || alt) && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60 font-light px-4 text-center max-w-[90vw]" dangerouslySetInnerHTML={{ __html: caption || alt }} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
