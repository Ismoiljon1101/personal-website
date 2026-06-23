"use client";

// Light-mode only: soft network dots in the hero section.
// Dark mode is handled globally by GlobalStarfield (fixed full-page canvas).

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    let animId: number;
    let dark = document.documentElement.classList.contains("dark");

    const dots: Dot[] = [];
    let mouse = { x: -9999, y: -9999 };
    const CONNECT = 120;

    function buildDots() {
      dots.length = 0;
      for (let i = 0; i < 50; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.4 + 0.6,
        });
      }
    }

    const observer = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildDots();
    };
    resize();
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("mouseleave", () => {
      mouse = { x: -9999, y: -9999 };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // In dark mode render nothing — GlobalStarfield covers everything
      if (!dark) {
        for (const d of dots) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
          if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 80 && dist > 0) {
            d.x += (dx / dist) * 1.5;
            d.y += (dy / dist) * 1.5;
          }

          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(80,90,160,0.32)";
          ctx.fill();
        }

        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const d = Math.hypot(dx, dy);
            if (d < CONNECT) {
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.strokeStyle = `rgba(80,90,160,${0.11 * (1 - d / CONNECT)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      style={{ zIndex: 0 }}
    />
  );
}
