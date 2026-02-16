import { motion } from "motion/react";

export default function HeroAnimated() {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Chip Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="inline-flex items-center gap-2.5 text-[0.75rem] font-medium text-teal bg-teal-glow border border-[rgba(45,212,191,0.2)] px-5 py-2 rounded-full mb-10"
      >
        <span>✦</span>
        Architecture × Design × Software × Games
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="text-[clamp(3rem,7.5vw,6rem)] font-bold tracking-tighter leading-[1.05] max-w-[850px]"
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
        className="text-[1.15rem] font-normal leading-relaxed text-text-secondary max-w-[560px] mt-6"
      >
        From parametric architecture to game engines to full-stack applications.
        A cross-disciplinary studio bridging physical and digital design.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        className="flex gap-4 mt-10"
      >
        <a href="/projects" className="btn-glow">
          Explore Projects
        </a>
        <a href="/about" className="btn-outline">
          About Us
        </a>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        className="flex gap-16 mt-20 flex-wrap justify-center"
      >
        {[
          { value: "5", label: "Services" },
          { value: "20+", label: "Projects Delivered" },
          { value: "2+", label: "Years Experience" },
          { value: "∞", label: "Ambition" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold tracking-tight gradient-text-teal">
              {stat.value}
            </div>
            <div className="text-[0.75rem] font-normal text-text-tertiary mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
