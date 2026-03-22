import { useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";

// ════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════

interface FloatingProject {
  title: string;
  icon: string;
  category: string;
  slug: string;
}

interface Props {
  projects?: FloatingProject[];
}

// ════════════════════════════════════════════════════════════════════
// Floater — generic draggable wrapper with ambient drift
// ════════════════════════════════════════════════════════════════════

function Floater({
  children,
  constraintRef,
  pos,
  delay = 0,
  drift = 1,
  href,
  mobileVisible = false,
}: {
  children: React.ReactNode;
  constraintRef: React.RefObject<HTMLDivElement | null>;
  pos: React.CSSProperties;
  delay?: number;
  drift?: number;
  href?: string;
  mobileVisible?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);

  const handleClick = () => {
    if (!isDragging && href) window.location.href = href;
  };

  return (
    <div
      className={`absolute z-10 ${mobileVisible ? "" : "hidden lg:block"}`}
      style={{
        ...pos,
        animation: `hero-drift-${drift} ${16 + drift * 4}s ease-in-out infinite`,
      }}
    >
      <motion.div
        drag
        dragConstraints={constraintRef}
        dragElastic={0.12}
        dragMomentum
        dragTransition={{ bounceStiffness: 250, bounceDamping: 20 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
        onClick={handleClick}
        style={{
          x: dragX,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        whileDrag={{ scale: 1.1, zIndex: 50 }}
        transition={{
          duration: 0.8,
          delay: 0.4 + delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="select-none"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Floating Object Components
// ════════════════════════════════════════════════════════════════════

/** Project card chip */
function ProjectChip({ project }: { project: FloatingProject }) {
  return (
    <div
      className="relative bg-bg-card/80 backdrop-blur-sm px-8 py-5 transition-all duration-300 group hover:bg-bg-card hover:shadow-[0_0_24px_rgba(45,212,191,0.12)]"
      style={{ filter: "drop-shadow(0 0 0.5px var(--color-border))" }}
      data-squircle="10"
    >
      <div>
        <p className="text-base font-medium text-text-primary/70 group-hover:text-text-primary transition-colors leading-tight max-w-[220px] truncate">
          {project.title}
        </p>
        <p className="text-xs font-mono text-text-tertiary tracking-[0.08em] uppercase">
          {project.category}
        </p>
      </div>
    </div>
  );
}

/** Image thumbnail — polaroid-like floating photo */
function ImageThumb({
  src,
  size = "sm",
}: {
  src: string;
  size?: "sm" | "md";
}) {
  const dims = size === "md" ? "w-[280px] h-[168px]" : "w-[220px] h-[132px]";
  return (
    <div
      className={`${dims} overflow-hidden opacity-35 hover:opacity-70 transition-opacity duration-300`}
      style={{ filter: "drop-shadow(0 0 0.5px var(--color-border))" }}
      data-squircle="8"
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}


/** Dot grid — 3x3 arrangement */
function DotGrid() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-text-tertiary/15" />
      ))}
    </div>
  );
}

/** Crosshair shape */
function Crosshair() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute top-1/2 left-0 w-full h-px bg-teal/15 -translate-y-1/2" />
      <div className="absolute top-0 left-1/2 w-px h-full bg-teal/15 -translate-x-1/2" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Main Hero Component
// ════════════════════════════════════════════════════════════════════

export default function HeroAnimated({ projects = [] }: Props) {
  const constraintRef = useRef<HTMLDivElement>(null);
  const p = projects.slice(0, 12);

  return (
    <div
      ref={constraintRef}
      className="relative w-full h-dvh overflow-hidden"
    >
      {/* ─── Floating Project Cards ─────────────────────────────── */}
      {p[0] && (
        <Floater constraintRef={constraintRef} pos={{ top: "6%", left: "3%" }} delay={0.3} drift={1} href={`/projects/${p[0].slug}`}>
          <ProjectChip project={p[0]} />
        </Floater>
      )}
      {p[1] && (
        <Floater constraintRef={constraintRef} pos={{ top: "14%", right: "5%" }} delay={0.7} drift={2} href={`/projects/${p[1].slug}`}>
          <ProjectChip project={p[1]} />
        </Floater>
      )}
      {p[2] && (
        <Floater constraintRef={constraintRef} pos={{ top: "50%", left: "1%" }} delay={1.1} drift={3} href={`/projects/${p[2].slug}`}>
          <ProjectChip project={p[2]} />
        </Floater>
      )}
      {p[3] && (
        <Floater constraintRef={constraintRef} pos={{ top: "56%", right: "2%" }} delay={0.5} drift={4} href={`/projects/${p[3].slug}`}>
          <ProjectChip project={p[3]} />
        </Floater>
      )}
      {p[4] && (
        <Floater constraintRef={constraintRef} pos={{ top: "82%", left: "5%" }} delay={0.9} drift={5} href={`/projects/${p[4].slug}`}>
          <ProjectChip project={p[4]} />
        </Floater>
      )}
      {p[5] && (
        <Floater constraintRef={constraintRef} pos={{ top: "80%", right: "7%" }} delay={1.5} drift={1} href={`/projects/${p[5].slug}`}>
          <ProjectChip project={p[5]} />
        </Floater>
      )}

      {/* ─── Floating Image Thumbnails ──────────────────────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "22%", left: "5%" }} delay={0.5} drift={4}>
        <ImageThumb src="/images/placeholder-1.svg" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "68%", right: "4%" }} delay={1.3} drift={2}>
        <ImageThumb src="/images/placeholder-3.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "32%", right: "6%" }} delay={0.9} drift={5}>
        <ImageThumb src="/images/placeholder-5.svg" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "75%", left: "18%" }} delay={1.7} drift={3}>
        <ImageThumb src="/images/placeholder-2.svg" />
      </Floater>

      {/* ─── Floating Symbols ───────────────────────────────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "20%", left: "20%" }} delay={0.4} drift={2}>
        <span className="text-teal/20 text-7xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "72%", right: "18%" }} delay={1.6} drift={4}>
        <span className="text-cyan/20 text-6xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "16%", left: "50%" }} delay={0.3} drift={5}>
        <span className="text-violet/15 text-5xl">◇</span>
      </Floater>

      {/* ─── Decorative Shapes ──────────────────────────────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "13%", left: "56%" }} delay={0.4} drift={3}>
        <div className="w-20 h-20 rounded-full border border-teal/10" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "74%", left: "40%" }} delay={1.0} drift={1}>
        <DotGrid />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "46%", right: "14%" }} delay={0.7} drift={5}>
        <Crosshair />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "35%", left: "36%" }} delay={1.2} drift={2}>
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "60%", left: "55%" }} delay={0.8} drift={4}>
        <div className="w-36 h-px bg-gradient-to-r from-transparent via-teal/15 to-transparent" />
      </Floater>

      {/* ─── Additional Project Cards (center area) ────────────── */}
      {p[6] && (
        <Floater constraintRef={constraintRef} pos={{ top: "30%", left: "15%" }} delay={0.4} drift={2} href={`/projects/${p[6].slug}`}>
          <ProjectChip project={p[6]} />
        </Floater>
      )}
      {p[7] && (
        <Floater constraintRef={constraintRef} pos={{ top: "38%", right: "12%" }} delay={0.8} drift={4} href={`/projects/${p[7].slug}`}>
          <ProjectChip project={p[7]} />
        </Floater>
      )}
      {p[8] && (
        <Floater constraintRef={constraintRef} pos={{ top: "48%", left: "25%" }} delay={1.0} drift={3} href={`/projects/${p[8].slug}`}>
          <ProjectChip project={p[8]} />
        </Floater>
      )}
      {p[9] && (
        <Floater constraintRef={constraintRef} pos={{ top: "44%", right: "22%" }} delay={0.6} drift={1} href={`/projects/${p[9].slug}`}>
          <ProjectChip project={p[9]} />
        </Floater>
      )}
      {p[10] && (
        <Floater constraintRef={constraintRef} pos={{ top: "60%", left: "10%" }} delay={1.3} drift={5} href={`/projects/${p[10].slug}`}>
          <ProjectChip project={p[10]} />
        </Floater>
      )}
      {p[11] && (
        <Floater constraintRef={constraintRef} pos={{ top: "64%", right: "8%" }} delay={0.9} drift={2} href={`/projects/${p[11].slug}`}>
          <ProjectChip project={p[11]} />
        </Floater>
      )}

      {/* ─── Additional Image Thumbnails (covering center) ───── */}
      <Floater constraintRef={constraintRef} pos={{ top: "28%", left: "30%" }} delay={0.6} drift={3}>
        <ImageThumb src="/images/placeholder-1.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "40%", right: "25%" }} delay={1.1} drift={1}>
        <ImageThumb src="/images/placeholder-2.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "55%", left: "35%" }} delay={0.8} drift={4}>
        <ImageThumb src="/images/placeholder-3.svg" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "52%", right: "30%" }} delay={1.4} drift={2}>
        <ImageThumb src="/images/placeholder-5.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "18%", left: "40%" }} delay={0.3} drift={5}>
        <ImageThumb src="/images/placeholder-2.svg" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "65%", left: "45%" }} delay={1.6} drift={3}>
        <ImageThumb src="/images/placeholder-1.svg" size="md" />
      </Floater>

      {/* ─── Additional Symbols (scattered over text) ─────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "35%", left: "45%" }} delay={0.5} drift={3}>
        <span className="text-teal/25 text-7xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "48%", right: "35%" }} delay={0.7} drift={1}>
        <span className="text-cyan/25 text-6xl">◇</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "30%", left: "55%" }} delay={1.0} drift={4}>
        <span className="text-violet/20 text-5xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "58%", left: "28%" }} delay={1.3} drift={2}>
        <span className="text-pink/20 text-6xl">◇</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "42%", left: "60%" }} delay={0.9} drift={5}>
        <span className="text-teal/30 text-5xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "55%", right: "40%" }} delay={1.5} drift={3}>
        <span className="text-cyan/20 text-7xl">✦</span>
      </Floater>

      {/* ─── Additional Decorative Shapes (center coverage) ──── */}
      <Floater constraintRef={constraintRef} pos={{ top: "25%", left: "42%" }} delay={0.3} drift={2}>
        <div className="w-24 h-24 rounded-full border border-cyan/10" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "50%", left: "50%" }} delay={0.7} drift={4}>
        <DotGrid />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "38%", left: "32%" }} delay={1.1} drift={1}>
        <Crosshair />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "62%", right: "35%" }} delay={0.5} drift={3}>
        <Crosshair />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "45%", left: "20%" }} delay={0.8} drift={5}>
        <div className="w-44 h-px bg-gradient-to-r from-transparent via-teal/20 to-transparent" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "40%", right: "20%" }} delay={1.2} drift={2}>
        <div className="w-44 h-px bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "55%", left: "42%" }} delay={0.6} drift={4}>
        <div className="w-36 h-px bg-gradient-to-r from-transparent via-violet/15 to-transparent" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "32%", right: "38%" }} delay={1.4} drift={1}>
        <DotGrid />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "60%", left: "60%" }} delay={0.9} drift={3}>
        <div className="w-18 h-18 rounded-full border border-violet/10" />
      </Floater>

      {/* ─── Extra Project Cards (fill remaining gaps) ────────── */}
      {p[0] && (
        <Floater constraintRef={constraintRef} pos={{ top: "24%", left: "38%" }} delay={0.2} drift={3} href={`/projects/${p[0].slug}`}>
          <ProjectChip project={p[0]} />
        </Floater>
      )}
      {p[1] && (
        <Floater constraintRef={constraintRef} pos={{ top: "42%", left: "42%" }} delay={0.6} drift={1} href={`/projects/${p[1].slug}`}>
          <ProjectChip project={p[1]} />
        </Floater>
      )}
      {p[2] && (
        <Floater constraintRef={constraintRef} pos={{ top: "55%", right: "15%" }} delay={1.0} drift={4} href={`/projects/${p[2].slug}`}>
          <ProjectChip project={p[2]} />
        </Floater>
      )}
      {p[3] && (
        <Floater constraintRef={constraintRef} pos={{ top: "70%", left: "30%" }} delay={0.4} drift={2} href={`/projects/${p[3].slug}`}>
          <ProjectChip project={p[3]} />
        </Floater>
      )}
      {p[4] && (
        <Floater constraintRef={constraintRef} pos={{ top: "18%", right: "20%" }} delay={0.8} drift={5} href={`/projects/${p[4].slug}`}>
          <ProjectChip project={p[4]} />
        </Floater>
      )}
      {p[5] && (
        <Floater constraintRef={constraintRef} pos={{ top: "36%", left: "8%" }} delay={1.2} drift={3} href={`/projects/${p[5].slug}`}>
          <ProjectChip project={p[5]} />
        </Floater>
      )}
      {p[6] && (
        <Floater constraintRef={constraintRef} pos={{ top: "72%", right: "25%" }} delay={0.3} drift={1} href={`/projects/${p[6].slug}`}>
          <ProjectChip project={p[6]} />
        </Floater>
      )}
      {p[7] && (
        <Floater constraintRef={constraintRef} pos={{ top: "10%", left: "45%" }} delay={0.9} drift={4} href={`/projects/${p[7].slug}`}>
          <ProjectChip project={p[7]} />
        </Floater>
      )}

      {/* ─── Extra Image Thumbnails ──────────────────────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "8%", left: "15%" }} delay={0.3} drift={2}>
        <ImageThumb src="/images/placeholder-1.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "35%", right: "3%" }} delay={0.7} drift={5}>
        <ImageThumb src="/images/placeholder-2.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "48%", left: "5%" }} delay={1.1} drift={3}>
        <ImageThumb src="/images/placeholder-3.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "78%", right: "35%" }} delay={0.5} drift={1}>
        <ImageThumb src="/images/placeholder-5.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "62%", left: "22%" }} delay={1.4} drift={4}>
        <ImageThumb src="/images/placeholder-2.svg" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "25%", right: "15%" }} delay={0.8} drift={2}>
        <ImageThumb src="/images/placeholder-1.svg" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "85%", left: "40%" }} delay={1.0} drift={5}>
        <ImageThumb src="/images/placeholder-3.svg" size="md" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "44%", left: "52%" }} delay={0.4} drift={3}>
        <ImageThumb src="/images/placeholder-5.svg" />
      </Floater>

      {/* ─── Extra Symbols ───────────────────────────────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "8%", left: "60%" }} delay={0.2} drift={4}>
        <span className="text-teal/20 text-8xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "45%", right: "8%" }} delay={0.6} drift={2}>
        <span className="text-cyan/20 text-7xl">◇</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "68%", left: "12%" }} delay={1.0} drift={5}>
        <span className="text-violet/15 text-6xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "25%", left: "8%" }} delay={0.8} drift={1}>
        <span className="text-pink/20 text-7xl">◇</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "80%", right: "12%" }} delay={1.3} drift={3}>
        <span className="text-teal/25 text-6xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "50%", left: "65%" }} delay={0.4} drift={4}>
        <span className="text-cyan/15 text-8xl">◇</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "38%", left: "25%" }} delay={1.5} drift={2}>
        <span className="text-violet/20 text-7xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "65%", right: "45%" }} delay={0.7} drift={5}>
        <span className="text-pink/15 text-5xl">◇</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "15%", right: "40%" }} delay={1.1} drift={1}>
        <span className="text-teal/20 text-6xl">✦</span>
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "88%", left: "20%" }} delay={0.5} drift={3}>
        <span className="text-cyan/25 text-7xl">✦</span>
      </Floater>

      {/* ─── Extra Decorative Shapes ─────────────────────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "5%", right: "10%" }} delay={0.3} drift={4}>
        <div className="w-28 h-28 rounded-full border border-teal/8" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "40%", left: "48%" }} delay={0.9} drift={2}>
        <div className="w-20 h-20 rounded-full border border-cyan/8" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "70%", right: "5%" }} delay={1.3} drift={5}>
        <div className="w-24 h-24 rounded-full border border-violet/8" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "15%", left: "30%" }} delay={0.6} drift={1}>
        <DotGrid />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "58%", right: "20%" }} delay={1.0} drift={3}>
        <DotGrid />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "82%", left: "55%" }} delay={0.4} drift={4}>
        <Crosshair />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "28%", right: "30%" }} delay={0.8} drift={2}>
        <Crosshair />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "48%", left: "15%" }} delay={1.2} drift={5}>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-teal/15 to-transparent" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "72%", left: "50%" }} delay={0.5} drift={1}>
        <div className="w-44 h-px bg-gradient-to-r from-transparent via-cyan/12 to-transparent" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "20%", right: "8%" }} delay={1.4} drift={3}>
        <div className="w-36 h-px bg-gradient-to-r from-transparent via-violet/12 to-transparent" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "90%", right: "15%" }} delay={0.7} drift={4}>
        <DotGrid />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "3%", left: "42%" }} delay={1.1} drift={2}>
        <div className="w-16 h-16 rounded-full border border-pink/8" />
      </Floater>

      {/* ─── Corner Brackets (decorative framing) ───────────────── */}
      <Floater constraintRef={constraintRef} pos={{ top: "2%", left: "1%" }} delay={0.1} drift={2} mobileVisible>
        <div className="w-14 h-14 border-l border-t border-border/30" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ top: "2%", right: "1%" }} delay={0.15} drift={3} mobileVisible>
        <div className="w-14 h-14 border-r border-t border-border/30" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ bottom: "2%", left: "1%" }} delay={0.2} drift={4} mobileVisible>
        <div className="w-14 h-14 border-l border-b border-border/30" />
      </Floater>
      <Floater constraintRef={constraintRef} pos={{ bottom: "2%", right: "1%" }} delay={0.25} drift={5} mobileVisible>
        <div className="w-14 h-14 border-r border-b border-border/30" />
      </Floater>

      {/* ═══════════════════════════════════════════════════════════
           Center Content — non-draggable, layered above floaters
         ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        {/* Chip Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 text-[0.75rem] font-medium text-teal bg-teal-glow px-5 py-2 mb-10"
          style={{ filter: "drop-shadow(0 0 0.5px rgba(45,212,191,0.2))" }}
          data-squircle="10"
        >
          <span>✦</span>
          Architecture × Design × Software × Games
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-[clamp(2.2rem,7.5vw,6rem)] font-bold tracking-tighter leading-[1.05] max-w-[850px] text-center px-6"
        >
          We design and build
          <br />
          across{" "}
          <span className="relative inline">
            every medium
            <span
              className="absolute bottom-[0.05em] left-0 w-full h-[0.12em] rounded-sm opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-teal), var(--color-cyan))",
              }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-[clamp(0.9rem,2vw,1.15rem)] font-normal leading-relaxed text-text-secondary max-w-[560px] mt-6 text-center px-6"
        >
          From parametric architecture to game engines to full-stack
          applications. A cross-disciplinary studio bridging physical and
          digital design.
        </motion.p>
      </div>
    </div>
  );
}
