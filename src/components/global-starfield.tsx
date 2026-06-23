"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  opacityDir: number;
  opacitySpeed: number;
  vx: number;
  vy: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  decay: number;
}

const COLORS = [
  "255,255,255",
  "220,232,255",
  "255,248,215",
  "200,215,255",
  "240,248,255",
];

export function GlobalStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    let animId: number;
    let dark = document.documentElement.classList.contains("dark");

    const stars: Star[] = [];
    const shoots: ShootingStar[] = [];
    let shootTimer = 0;
    // Interval 60–120 frames between spawns
    let nextShootAt = 80 + Math.random() * 60;

    function setSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setSize();

    function buildStars() {
      stars.length = 0;
      const count = Math.max(
        120,
        Math.floor((canvas.width * canvas.height) / 4200)
      );
      for (let i = 0; i < count; i++) {
        const base = Math.random() * 0.6 + 0.2;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.15,
          opacity: base,
          opacityDir: Math.random() > 0.5 ? 1 : -1,
          opacitySpeed: Math.random() * 0.008 + 0.002,
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.06,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    function spawnShoot() {
      const W = canvas.width;
      const H = canvas.height;
      const speed = 7 + Math.random() * 9;

      // 0 = top, 1 = right, 2 = left, 3 = bottom
      // Weighted: top/left/right more likely than bottom
      const weights = [0.4, 0.25, 0.25, 0.1];
      const r = Math.random();
      let side = 0;
      let acc = 0;
      for (let i = 0; i < weights.length; i++) {
        acc += weights[i];
        if (r < acc) { side = i; break; }
      }

      let x = 0, y = 0, angle = 0;

      if (side === 0) {
        // From top — shoot downward with slight diagonal
        x = Math.random() * W;
        y = -10;
        angle = Math.PI / 2 + (Math.random() - 0.5) * 1.0;
      } else if (side === 1) {
        // From right — shoot leftward
        x = W + 10;
        y = Math.random() * H;
        angle = Math.PI + (Math.random() - 0.5) * 1.0;
      } else if (side === 2) {
        // From left — shoot rightward
        x = -10;
        y = Math.random() * H;
        angle = 0 + (Math.random() - 0.5) * 1.0;
      } else {
        // From bottom — shoot upward
        x = Math.random() * W;
        y = H + 10;
        angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.0;
      }

      shoots.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 120,
        life: 0,
        decay: 0.013 + Math.random() * 0.009,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!dark) {
        // Nothing rendered in light mode
        animId = requestAnimationFrame(draw);
        return;
      }

      // ── Shooting stars ──────────────────────────────────────────────
      shootTimer++;
      if (shootTimer >= nextShootAt) {
        shootTimer = 0;
        nextShootAt = 60 + Math.random() * 80;
        // Spawn 1–2 at once occasionally
        spawnShoot();
        if (Math.random() > 0.65) spawnShoot();
      }

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life += s.decay;

        // Remove if off canvas or fully dead
        if (
          s.life >= 1 ||
          s.x < -200 || s.x > canvas.width + 200 ||
          s.y < -200 || s.y > canvas.height + 200
        ) {
          shoots.splice(i, 1);
          continue;
        }

        const alpha = Math.sin(s.life * Math.PI) * 0.92;
        const spd = Math.hypot(s.vx, s.vy);
        const tailX = s.x - (s.vx / spd) * s.length;
        const tailY = s.y - (s.vy / spd) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, `rgba(200,220,255,${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Glowing head
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(200,220,255,0.9)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Static star field ───────────────────────────────────────────
      for (const st of stars) {
        st.x += st.vx;
        st.y += st.vy;
        // Wrap around edges
        if (st.x < 0) st.x += canvas.width;
        if (st.x > canvas.width) st.x -= canvas.width;
        if (st.y < 0) st.y += canvas.height;
        if (st.y > canvas.height) st.y -= canvas.height;

        // Twinkle
        st.opacity += st.opacityDir * st.opacitySpeed;
        if (st.opacity > 0.88) { st.opacity = 0.88; st.opacityDir = -1; }
        if (st.opacity < 0.06) { st.opacity = 0.06; st.opacityDir = 1; }

        // Glow on larger stars
        if (st.r > 0.85) {
          ctx.shadowBlur = st.r > 1.1 ? 4 : 2;
          ctx.shadowColor = `rgba(${st.color},0.65)`;
        }

        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${st.color},${st.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(draw);
    }

    // Watch for dark/light toggle
    const observer = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      if (dark) buildStars();
      else { stars.length = 0; shoots.length = 0; }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onResize = () => {
      setSize();
      if (dark) buildStars();
    };
    window.addEventListener("resize", onResize);

    if (dark) buildStars();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
