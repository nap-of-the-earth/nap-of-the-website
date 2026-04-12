import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

interface BlueprintEmbedProps {
  blueprintCode: string;
  title?: string;
  caption?: string;
  height?: string;
  theme?: "light" | "dark";
  zoom?: number;
}

export default function BlueprintEmbed({
  blueprintCode,
  title = "Blueprint Graph",
  caption,
  height = "600px",
  theme = "dark",
  zoom = 1,
}: BlueprintEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cssLoadedRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const close = useCallback(() => setIsFullscreen(false), []);

  // Load CSS once
  useEffect(() => {
    if (!cssLoadedRef.current && typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/vendor/ueb-style.min.css";
      document.head.appendChild(link);
      cssLoadedRef.current = true;
    }
  }, []);

  // Render blueprint into the container
  useEffect(() => {
    renderBlueprint(containerRef.current, blueprintCode, theme, height);
  }, [blueprintCode, theme, height, zoom]);

  // Fullscreen: apply fixed positioning in-place (no DOM reparenting)
  useEffect(() => {
    const container = containerRef.current;
    const ueb = container?.querySelector("ueb-blueprint") as HTMLElement | null;
    if (!container) return;

    const overlays: HTMLElement[] = [];
    if (isFullscreen) {
      document.querySelectorAll("nav, [class*='fixed'], [class*='sticky']").forEach((el) => {
        const style = getComputedStyle(el);
        if (
          (style.position === "fixed" || style.position === "sticky") &&
          !container.contains(el)
        ) {
          overlays.push(el as HTMLElement);
        }
      });
    }

    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      overlays.forEach((el) => {
        el.dataset.bpHidden = el.style.display;
        el.style.display = "none";
      });
      container.style.position = "fixed";
      container.style.inset = "0";
      container.style.zIndex = "99999";
      container.style.minHeight = "100vh";
      container.style.width = "100vw";
      container.style.borderRadius = "0";
      container.style.border = "none";
      if (ueb) ueb.style.setProperty("--ueb-height", "100vh");
    } else {
      document.body.style.overflow = "";
      container.style.position = "";
      container.style.inset = "";
      container.style.zIndex = "";
      container.style.minHeight = height;
      container.style.width = "";
      container.style.borderRadius = "";
      container.style.border = "";
      if (ueb) ueb.style.setProperty("--ueb-height", height);
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isFullscreen) window.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
      overlays.forEach((el) => {
        el.style.display = el.dataset.bpHidden ?? "";
        delete el.dataset.bpHidden;
      });
    };
  }, [isFullscreen, height, close]);

  return (
    <>
      <figure className="my-8">
        <div className="relative group">
          <div
            ref={containerRef}
            className="relative w-full rounded-lg overflow-hidden border border-border bg-background"
            style={{ minHeight: height }}
            title={title}
          />
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-card border border-border hover:border-border-hover rounded px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary z-10 cursor-pointer"
            aria-label="View fullscreen"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
        {caption && (
          <figcaption className="text-sm text-text-tertiary text-center mt-3 font-light">
            {caption}
          </figcaption>
        )}
      </figure>

      {isFullscreen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100000] pointer-events-none"
            >
              <button
                onClick={close}
                className="pointer-events-auto absolute top-6 right-6 text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <div className="text-sm text-white/40 font-light">
                  Drag to pan · Scroll to zoom · Press ESC to close
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

async function renderBlueprint(
  container: HTMLDivElement | null,
  blueprintCode: string,
  theme: string,
  height: string
) {
  if (typeof window === "undefined" || !container) return;

  try {
    const themeClass = theme === "light" ? "ueb-light-mode" : "";
    const processedCode = blueprintCode.replace(
      /Class=(\/Script\/[^\s]+)/g,
      'Class="$1"'
    );
    // @ts-ignore — ueblueprint has no type declarations
    await import("ueblueprint");
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<body><ueb-blueprint class="${themeClass}" style="--ueb-height: ${height}"><template>${processedCode}</template></ueb-blueprint></body>`,
      "text/html"
    );
    const parsed = doc.querySelector("ueb-blueprint");
    if (parsed) {
      container.innerHTML = "";
      container.appendChild(document.adoptNode(parsed));
    }
  } catch (error) {
    console.error("Failed to load ueblueprint:", error);
  }
}
