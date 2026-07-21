/**
 * Global Network Background v2 - Premium Corporate Globe Effect
 * Creates a digital planet with curved connections, luminous hubs, propagation waves
 * Extremely lightweight canvas animation
 */

(function () {
  "use strict";

  const canvas = document.createElement("canvas");
  canvas.id = "network-canvas";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
    pointerEvents: "none",
    opacity: "0.5",
  });

  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let width, height, dpr;
  let nodes = [];
  let wavePoints = [];
  let time = 0;

  const NODE_COUNT = 55;
  const CONNECTION_DIST = 200;
  const HUB_COUNT = 6;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function createNodes() {
    nodes = [];
    // Create clusters to simulate continents
    const clusters = [
      { cx: width * 0.25, cy: height * 0.3 }, // North America
      { cx: width * 0.5, cy: height * 0.35 }, // Europe
      { cx: width * 0.75, cy: height * 0.4 }, // Asia
      { cx: width * 0.3, cy: height * 0.7 }, // South America
      { cx: width * 0.6, cy: height * 0.7 }, // Africa
      { cx: width * 0.85, cy: height * 0.6 }, // Oceania
    ];

    for (let i = 0; i < NODE_COUNT; i++) {
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 150;

      nodes.push({
        x: cluster.cx + Math.cos(angle) * radius,
        y: cluster.cy + Math.sin(angle) * radius,
        baseX: cluster.cx + Math.cos(angle) * radius,
        baseY: cluster.cy + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        radius: Math.random() * 2.5 + 1.2,
        alpha: 0.3 + Math.random() * 0.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.015,
        isHub: false,
        hubGlow: 0,
        connections: 0,
      });
    }

    // Create hub nodes (bright, connected)
    for (let i = 0; i < HUB_COUNT; i++) {
      if (i < nodes.length) {
        nodes[i].radius = 4 + Math.random() * 2.5;
        nodes[i].alpha = 0.7 + Math.random() * 0.3;
        nodes[i].isHub = true;
        nodes[i].hubGlow = 20 + Math.random() * 30;
      }
    }
  }

  function updateNodes() {
    time += 0.003;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx + Math.sin(time + i) * 0.02;
      n.y += n.vy + Math.cos(time * 0.7 + i) * 0.02;
      n.pulse += n.pulseSpeed;

      // Keep nodes near their base position (elastic return)
      n.x += (n.baseX - n.x) * 0.001;
      n.y += (n.baseY - n.y) * 0.001;

      n.connections = 0;
    }

    // Count connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          nodes[i].connections++;
          nodes[j].connections++;
        }
      }
    }

    // Manage wave propagation
    if (Math.random() < 0.02 && wavePoints.length < 8) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      wavePoints.push({
        x: source.x,
        y: source.y,
        radius: 0,
        maxRadius: 40 + Math.random() * 80,
        alpha: 0.6,
        speed: 0.4 + Math.random() * 0.3,
      });
    }

    for (let i = wavePoints.length - 1; i >= 0; i--) {
      const w = wavePoints[i];
      w.radius += w.speed;
      w.alpha -= 0.008;
      if (w.alpha <= 0 || w.radius > w.maxRadius) {
        wavePoints.splice(i, 1);
      }
    }
  }

  function drawCurvedConnection(x1, y1, x2, y2, alpha, lineWidth) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Curve control point - creates gentle arc
    const perpX = -dy * 0.15;
    const perpY = dx * 0.15;
    const cpx = midX + perpX;
    const cpy = midY + perpY;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpx, cpy, x2, y2);
    ctx.strokeStyle = `rgba(60, 140, 240, ${alpha})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    updateNodes();

    // Draw curved connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const t = 1 - dist / CONNECTION_DIST;
          const alpha = t * 0.35;
          const lw = t * 1.0;
          drawCurvedConnection(
            nodes[i].x,
            nodes[i].y,
            nodes[j].x,
            nodes[j].y,
            alpha,
            lw,
          );
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const pulseAlpha = Math.max(0.2, n.alpha + Math.sin(n.pulse) * 0.15);
      const glowScale = 1 + Math.sin(n.pulse) * 0.15;
      const r = n.radius * glowScale;
      const glowR = r * (n.isHub ? 8 : 4);

      // Outer glow
      const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
      const glowColor = n.isHub
        ? `rgba(0, 180, 255, ${pulseAlpha * 0.25})`
        : `rgba(60, 140, 240, ${pulseAlpha * 0.15})`;
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, "rgba(0, 150, 255, 0)");
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.isHub
        ? `rgba(180, 220, 255, ${pulseAlpha})`
        : `rgba(100, 180, 255, ${pulseAlpha})`;
      ctx.fill();

      // Bright center for hubs
      if (n.isHub) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 240, 255, ${pulseAlpha * 0.9})`;
        ctx.fill();
      }
    }

    // Draw wave propagation
    for (const w of wavePoints) {
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 180, 255, ${w.alpha * 0.4})`;
      ctx.lineWidth = 1.5 * (1 - w.radius / w.maxRadius) + 0.3;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createNodes();
    draw();
  }

  window.addEventListener("resize", () => {
    resize();
    createNodes();
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  if (!prefersReducedMotion.matches) {
    init();
  } else {
    canvas.style.display = "none";
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      canvas.style.display = "none";
    } else {
      canvas.style.display = "block";
      if (!prefersReducedMotion.matches && nodes.length === 0) {
        init();
      }
    }
  });
})();
