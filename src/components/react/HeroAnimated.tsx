import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

interface FloatingProject {
  title: string;
  icon: string;
  category: string;
  slug: string;
}

interface Props {
  projects?: FloatingProject[];
}

const MARQUEE_ITEMS = [
  "Architecture",
  "Grasshopper",
  "Unreal Engine 5",
  "React",
  "TypeScript",
  "Rhino",
  "C++",
  "Figma",
  "After Effects",
  "DirectX 11",
  "Node.js",
  "V-Ray",
  "Unity",
  "Blender",
  "Tailwind CSS",
  "Revit",
  "HLSL",
  "PostgreSQL",
  "Astro",
  "Illustrator",
];

const FLOAT_POSITIONS = [
  { top: "6%", left: "4%", rotate: -8, delay: 0 },
  { top: "12%", right: "6%", rotate: 6, delay: 0.8 },
  { top: "55%", left: "2%", rotate: 5, delay: 1.6 },
  { top: "62%", right: "3%", rotate: -10, delay: 0.4 },
  { top: "82%", left: "10%", rotate: 3, delay: 1.2 },
  { top: "78%", right: "12%", rotate: -5, delay: 2.0 },
];

function DraggableThumb({
  project,
  pos,
  constraintRef,
}: {
  project: FloatingProject;
  pos: (typeof FLOAT_POSITIONS)[number];
  constraintRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const rotateZ = useTransform(dragX, [-200, 200], [pos.rotate - 6, pos.rotate + 6]);

  const handleClick = () => {
    if (!isDragging) {
      window.location.href = `/projects/${project.slug}`;
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={constraintRef}
      dragElastic={0.15}
      dragMomentum
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      onClick={handleClick}
      style={{ x: dragX, rotateZ }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileDrag={{ scale: 1.12, zIndex: 50 }}
      transition={{
        duration: 0.8,
        delay: 0.6 + pos.delay,
        ease: "easeOut",
      }}
      className="absolute hidden lg:block z-0 select-none group"
      // Position styles applied via inline to avoid Tailwind conflicts with drag
      // eslint-disable-next-line react/no-unknown-property
      {...{
        style: {
          x: dragX,
          rotateZ,
          top: pos.top,
          left: "left" in pos ? pos.left : undefined,
          right: "right" in pos ? pos.right : undefined,
          cursor: isDragging ? "grabbing" : "grab",
        },
      }}
    >
      <div
        className={`relative bg-bg-card/80 backdrop-blur-sm px-4 py-3 transition-all duration-300 ${
          isDragging
            ? "bg-bg-card shadow-[0_0_32px_rgba(45,212,191,0.18)] scale-105"
            : "group-hover:bg-bg-card group-hover:shadow-[0_0_24px_rgba(45,212,191,0.12)]"
        }`}
        style={{
          filter: isDragging
            ? "drop-shadow(0 0 1px rgba(45,212,191,0.5))"
            : "drop-shadow(0 0 0.5px var(--color-border))",
          transition: "filter 0.3s, background 0.3s, box-shadow 0.3s",
        }}
        data-squircle="10"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
            {project.icon}
          </span>
          <div className="text-left">
            <p className="text-[0.7rem] font-medium text-text-primary/70 group-hover:text-text-primary transition-colors leading-tight max-w-[120px] truncate">
              {project.title}
            </p>
            <p className="text-[0.55rem] font-mono text-text-tertiary tracking-[0.08em] uppercase">
              {project.category}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroAnimated({ projects = [] }: Props) {
  const constraintRef = useRef<HTMLDivElement>(null);
  const displayProjects = projects.slice(0, FLOAT_POSITIONS.length);

  return (
    <div ref={constraintRef} className="relative w-full flex flex-col items-center text-center">
      {/* Floating Draggable Project Thumbnails */}
      {displayProjects.map((project, i) => (
        <DraggableThumb
          key={project.slug}
          project={project}
          pos={FLOAT_POSITIONS[i]}
          constraintRef={constraintRef}
        />
      ))}

      {/* Chip Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-1 pointer-events-none inline-flex items-center gap-2.5 text-[0.75rem] font-medium text-teal bg-teal-glow px-5 py-2 mb-10"
        style={{ filter: "drop-shadow(0 0 0.5px rgba(45,212,191,0.2))" }}
        data-squircle="10"
      >
        <span>✦</span>
        Architecture × Design × Software × Games
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="relative z-1 pointer-events-none text-[clamp(3rem,7.5vw,6rem)] font-bold tracking-tighter leading-[1.05] max-w-[850px]"
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="relative z-1 pointer-events-none text-[1.15rem] font-normal leading-relaxed text-text-secondary max-w-[560px] mt-6"
      >
        From parametric architecture to game engines to full-stack applications.
        A cross-disciplinary studio bridging physical and digital design.
      </motion.p>

      {/* Scrolling Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-1 pointer-events-none w-screen mt-20 overflow-hidden marquee-mask"
      >
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-text-tertiary whitespace-nowrap mx-4 flex items-center gap-4"
            >
              {item}
              <span className="text-teal/30 text-[0.5rem]">◆</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
