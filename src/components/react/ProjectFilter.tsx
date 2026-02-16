import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  context?: string;
  icon: string;
  tags: string[];
  featured: boolean;
}

interface Props {
  projects: Project[];
  categories: string[];
  contexts: string[];
}

export default function ProjectFilter({
  projects,
  categories,
  contexts,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeContext, setActiveContext] = useState("All");

  const filtered = projects.filter((p) => {
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    const ctxMatch = activeContext === "All" || p.context === activeContext;
    return catMatch && ctxMatch;
  });

  const countForCategory = (cat: string) =>
    projects.filter((p) => {
      const catMatch = cat === "All" || p.category === cat;
      const ctxMatch = activeContext === "All" || p.context === activeContext;
      return catMatch && ctxMatch;
    }).length;

  const countForContext = (ctx: string) =>
    projects.filter((p) => {
      const catMatch =
        activeCategory === "All" || p.category === activeCategory;
      const ctxMatch = ctx === "All" || p.context === ctx;
      return catMatch && ctxMatch;
    }).length;

  return (
    <div>
      {/* Row 1 — Category Filter */}
      <div className="flex gap-2 flex-wrap justify-center mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-teal text-bg border-teal"
                : "bg-transparent text-text-secondary border-border hover:border-border-hover hover:text-text-primary"
            }`}
          >
            {cat}
            <span className="ml-1.5 opacity-60">{countForCategory(cat)}</span>
          </button>
        ))}
      </div>

      {/* Row 2 — Context Filter */}
      <div className="flex gap-1.5 flex-wrap justify-center mb-12">
        {contexts.map((ctx) => (
          <button
            key={ctx}
            onClick={() => setActiveContext(ctx)}
            className={`font-mono text-[0.6rem] tracking-[0.08em] uppercase px-3 py-1 rounded-full transition-all cursor-pointer ${
              activeContext === ctx
                ? "bg-transparent text-text-primary border border-text-primary"
                : "bg-transparent text-text-tertiary border border-transparent hover:text-text-secondary hover:border-border"
            }`}
          >
            {ctx}
            <span className="ml-1 opacity-50">{countForContext(ctx)}</span>
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.a
              key={project.id}
              href={`/projects/${project.id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="omnius-card block no-underline group"
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="font-mono text-[0.65rem] text-teal tracking-[0.1em] uppercase">
                  {project.category}
                </p>
                {project.context && (
                  <span className="font-mono text-[0.55rem] text-text-tertiary tracking-[0.08em] uppercase border border-border rounded px-1.5 py-0.5">
                    {project.context}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold tracking-tight text-text-primary mb-2 group-hover:text-teal transition-colors">
                {project.title}
              </h3>

              <p className="text-sm font-normal leading-relaxed text-text-secondary mb-4">
                {project.description}
              </p>

              <div className="flex gap-1.5 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[0.6rem] text-text-tertiary bg-[rgba(255,255,255,0.04)] border border-border px-2 py-0.5 rounded-md group-hover:border-border-hover group-hover:text-text-secondary transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-tertiary text-sm">
            No projects match these filters.
          </p>
        </div>
      )}
    </div>
  );
}
