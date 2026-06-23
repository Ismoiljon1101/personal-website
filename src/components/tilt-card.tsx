"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className = "", intensity = 10 }: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { damping: 30, stiffness: 300 });
  const ySpring = useSpring(y, { damping: 30, stiffness: 300 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  // Shine effect position
  const shineX = useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.2 } }}
      className={`relative ${className}`}
    >
      {/* Shine overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }}
      />
      <div style={{ transform: "translateZ(4px)" }}>{children}</div>
    </motion.div>
  );
}
