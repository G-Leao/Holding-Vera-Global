/* CONTATO — Conexão e comunicação: nós, pulsos e ondas discretas */
(function () {
  "use strict";

  var hero = document.querySelector("[data-hero-canvas]");
  var nodes = [];

  window.VG.canvas(
    hero,
    function (ctx, w, h, t) {
      var cx = w / 2;
      var cy = h / 2;
      var base = Math.min(w, h) * 0.42;

      var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.4);
      glow.addColorStop(0, "rgba(37, 99, 235, 0.16)");
      glow.addColorStop(1, "rgba(37, 99, 235, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // ondas concêntricas — presença e alcance
      for (var r = 0; r < 3; r++) {
        var prog = (t * 0.0025 + r / 3) % 1;
        ctx.strokeStyle =
          "rgba(0, 180, 255," + (0.22 * (1 - prog)).toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, base * (0.12 + prog * 0.95), 0, Math.PI * 2);
        ctx.stroke();
      }

      // rede de contatos
      nodes.forEach(function (n, i) {
        var a = n.a + t * n.speed;
        n.px = cx + Math.cos(a) * base * n.r;
        n.py = cy + Math.sin(a) * base * n.r * 0.9;
        var pulse = (Math.sin(t * 0.02 + i) + 1) / 2;

        ctx.strokeStyle = "rgba(120, 165, 235, 0.12)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.px, n.py);
        ctx.stroke();

        // pulso viajando até o centro
        var prog2 = (t * 0.004 + i * 0.2) % 1;
        ctx.fillStyle = "rgba(0, 180, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(
          n.px + (cx - n.px) * prog2,
          n.py + (cy - n.py) * prog2,
          1.6,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        ctx.fillStyle =
          "rgba(210, 232, 255," + (0.5 + pulse * 0.4).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(n.px, n.py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // núcleo — a holding disponível
      ctx.fillStyle = "rgba(0, 180, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(cx, cy, 9 + Math.sin(t * 0.015) * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 180, 255, 0.5)";
      ctx.stroke();
    },
    {
      onResize: function () {
        nodes = [];
        for (var i = 0; i < 9; i++) {
          nodes.push({
            a: (i * Math.PI * 2) / 9,
            r: 0.45 + (i % 3) * 0.2,
            speed: 0.0006 + (i % 4) * 0.00018,
          });
        }
      },
    },
  );

  /* Fundo: ondas horizontais muito suaves */
  var bg = document.querySelector("[data-bg-canvas]");
  window.VG.canvas(bg, function (ctx, w, h, t) {
    ctx.lineWidth = 1;
    for (var i = 0; i < 5; i++) {
      ctx.strokeStyle =
        "rgba(120, 165, 235," + (0.04 - i * 0.005).toFixed(3) + ")";
      ctx.beginPath();
      for (var x = 0; x <= w; x += 12) {
        var y =
          h * (0.25 + i * 0.14) +
          Math.sin(x * 0.004 + t * 0.006 + i) * 18 +
          Math.sin(x * 0.001 - t * 0.003) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  });
})();
