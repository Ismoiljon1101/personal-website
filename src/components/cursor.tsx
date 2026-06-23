"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, { damping: 30, stiffness: 800 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 800 });

  const ringX = useSpring(mouseX, { damping: 40, stiffness: 180 });
  const ringY = useSpring(mouseY, { damping: 40, stiffness: 180 });

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const checkHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive = el.closest("a, button, [role='button'], input, textarea, select, label");
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.style.cursor = "";
    };
  }, [mouseX, mouseY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Dot — snaps exactly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: clicking ? 0.5 : 1 }}
        transition={{ duration: 0.1 }}
      >
        <div
          className="rounded-full bg-white"
          style={{
            width: hovering ? 6 : 5,
            height: hovering ? 6 : 5,
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* Ring — follows with lag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: hovering ? 1.8 : clicking ? 0.8 : 1,
          opacity: 0.6,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="rounded-full border border-white"
          style={{
            width: 32,
            height: 32,
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>
    </>
  );
}
