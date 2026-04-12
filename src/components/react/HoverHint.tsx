import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@lib/utils";

interface Props {
  children: ReactNode;
  hint?: string;
  image?: string;
  imageAlt?: string;
  /** Apply bold text */
  bold?: boolean;
  /** Apply italic text */
  italic?: boolean;
  /** Apply underline (dotted style) */
  underline?: boolean;
  /** Apply background highlight color */
  bg?: boolean;
  className?: string;
}

/**
 * Inline text with a rich hover tooltip.
 * Supports plain text hints, images, or both.
 * Desktop: hover to show/hide. Mobile: tap to toggle, tap outside to dismiss.
 * Auto-positions vertically (above/below) and clamps horizontally to viewport.
 */
export default function HoverHint({
  children,
  hint,
  image,
  imageAlt = "",
  bold = false,
  italic = false,
  underline = false,
  bg = false,
  className,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [above, setAbove] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Detect touch device on first touch event
  useEffect(() => {
    const onTouch = () => setIsTouch(true);
    window.addEventListener("touchstart", onTouch, { once: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  // Dismiss on tap outside (mobile)
  useEffect(() => {
    if (!visible || !isTouch) return;

    const onTapOutside = (e: TouchEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("touchstart", onTapOutside);
    return () => document.removeEventListener("touchstart", onTapOutside);
  }, [visible, isTouch]);

  const reposition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();

    // Vertical: show below if not enough space above
    setAbove(triggerRect.top > 240);

    // Horizontal: clamp tooltip to viewport edges
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const pad = 12;
      let shift = 0;

      if (tooltipRect.left < pad) {
        shift = pad - tooltipRect.left;
      } else if (tooltipRect.right > window.innerWidth - pad) {
        shift = window.innerWidth - pad - tooltipRect.right;
      }

      setOffsetX(shift);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      setOffsetX(0);
      return;
    }
    requestAnimationFrame(reposition);
  }, [visible, reposition]);

  // Desktop: hover to show/hide
  const show = () => {
    if (isTouch) return;
    clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    if (isTouch) return;
    timeoutRef.current = setTimeout(() => setVisible(false), 150);
  };

  // Mobile: tap to toggle
  const handleTap = () => {
    if (!isTouch) return;
    setVisible((v) => !v);
  };
  return (
    <span className="relative inline" ref={triggerRef}>
      <span
        className={cn(
          bold && "font-semibold",
          italic && "italic",
          underline && "underline decoration-dotted underline-offset-4 decoration-text-tertiary hover:decoration-blue",
          bg && "bg-accent/10 hover:bg-accent/20 rounded px-1",
          (hint || image) && "cursor-help",
          "transition-colors",
          className
        )}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={handleTap}
        tabIndex={0}
        role="button"
        aria-expanded={visible}
        aria-describedby={visible ? "hover-hint-popup" : undefined}
      >
        {children}
      </span>
      {/* Desktop: absolute tooltip near trigger */}
      {visible && !isTouch && (hint || image) && (
        <span
          ref={tooltipRef}
          id="hover-hint-popup"
          role="tooltip"
          className={cn(
            "absolute left-1/2 z-50 pointer-events-none",
            "w-64 p-3 rounded-lg",
            "bg-bg-card border border-border-hover shadow-lg shadow-black/40",
            "text-sm font-normal not-italic no-underline text-text-secondary",
            "opacity-0 animate-[fade-up_0.2s_ease_forwards]",
            above ? "bottom-full mb-3" : "top-full mt-3"
          )}
          style={{ transform: `translateX(calc(-50% + ${offsetX}px))` }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="w-full rounded mb-2 border border-border"
            />
          )}
          {hint && <span className="leading-relaxed">{hint}</span>}
          <span
            className={cn(
              "absolute w-2 h-2 rotate-45",
              "bg-bg-card border-border-hover",
              above
                ? "top-full -mt-1 border-b border-r"
                : "bottom-full -mb-1 border-t border-l"
            )}
            style={{ left: `calc(50% - ${offsetX}px)`, transform: "translateX(-50%) rotate(45deg)" }}
          />
        </span>
      )}
      {/* Mobile: fixed tooltip centered on viewport */}
      {visible && isTouch && (hint || image) && (
        <span
          id="hover-hint-popup"
          role="tooltip"
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "pointer-events-auto",
            "w-72 p-4 rounded-xl",
            "bg-bg-card border border-border-hover shadow-2xl shadow-black/60",
            "text-sm font-normal not-italic no-underline text-text-secondary",
            "opacity-0 animate-[fade-up_0.2s_ease_forwards]"
          )}
        >
          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="w-full rounded mb-2 border border-border"
            />
          )}
          {hint && <span className="leading-relaxed">{hint}</span>}
        </span>
      )}
    </span>
  );
}
