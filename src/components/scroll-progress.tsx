"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[9990]"
      style={{
        scaleX,
        background: "linear-gradient(to right, #6366f1, #8b5cf6, #a855f7)",
      }}
    />
  );
}
