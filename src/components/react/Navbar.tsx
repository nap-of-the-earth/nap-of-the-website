import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV_ITEMS } from "@lib/constants";

/**
 * If we're on the homepage and the nav item has an anchor,
 * smooth-scroll to that section instead of navigating.
 */
function handleNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  item: (typeof NAV_ITEMS)[number],
  onAfter?: () => void
) {
  if ("external" in item && item.external) return;

  const isHome = window.location.pathname === "/";
  if (!isHome || !("anchor" in item) || !item.anchor) return;

  const target = document.querySelector(item.anchor);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth" });
  onAfter?.();
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen]);

  const closeMobile = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* Floating Pill Nav */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-2.5 flex items-center gap-8 rounded-full border transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(6,8,15,0.85)] backdrop-blur-2xl backdrop-saturate-[180%] border-border shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
            : "bg-[rgba(6,8,15,0.5)] backdrop-blur-xl border-[rgba(30,41,59,0.5)]"
        }`}
      >
        {/* Logo */}
        <a
          href="/"
          className="text-[0.9rem] font-bold text-text-primary no-underline tracking-tight"
        >
          nap of the earth
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-1 list-none m-0 p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                {...("external" in item && item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={(e) => handleNavClick(e, item)}
                className="text-[0.78rem] text-text-secondary no-underline px-3 py-1.5 rounded-full hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href="/about#contact"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              document
                .querySelector("#about")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="hidden md:inline-flex text-[0.78rem] font-medium text-bg bg-teal no-underline px-5 py-1.5 rounded-full hover:opacity-85 transition-opacity"
        >
          Contact
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer z-[60]"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-text-primary origin-center"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-px bg-text-primary"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-text-primary origin-center"
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden overflow-y-auto"
            style={{ background: "var(--mobile-overlay-bg)" }}
          >
            <motion.ul
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center gap-2 pt-24 pb-24 list-none m-0 p-0"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <a
                    href={item.href}
                    {...("external" in item && item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    onClick={(e) => {
                      handleNavClick(e, item, closeMobile);
                      closeMobile();
                    }}
                    className="text-lg text-text-secondary no-underline px-6 py-3 rounded-lg hover:text-text-primary hover:bg-bg-card transition-colors block"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + NAV_ITEMS.length * 0.05 }}
              >
                <a
                  href="/about#contact"
                  onClick={(e) => {
                    if (window.location.pathname === "/") {
                      e.preventDefault();
                      closeMobile();
                      setTimeout(() => {
                        document
                          .querySelector("#about")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 50);
                    } else {
                      closeMobile();
                    }
                  }}
                  className="text-lg font-medium text-bg bg-teal no-underline px-8 py-3 rounded-full hover:opacity-85 transition-opacity block mt-4"
                >
                  Contact
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
