/* ÁREAS DE ATUAÇÃO — Expansão abstrata de uma grande organização */
(function () {
  "use strict";

  var hero = document.querySelector("[data-hero-canvas]");
  var SECTORS = 6;

  window.VG.canvas(hero, function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var base = Math.min(w, h) * 0.42;

    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.3);
    glow.addColorStop(0, "rgba(37, 99, 235, 0.16)");
    glow.addColorStop(1, "rgba(37, 99, 235, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Anéis de expansão contínua
    for (var r = 0; r < 4; r++) {
      var prog = (t * 0.0016 + r / 4) % 1;
      var radius = base * (0.18 + prog * 0.9);
      var alpha = 0.22 * (1 - prog);
      ctx.strokeStyle = "rgba(120, 165, 235," + alpha.toFixed(3) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Setores: linhas que se abrem lentamente
    for (var s = 0; s < SECTORS; s++) {
      var a = (s * Math.PI * 2) / SECTORS + t * 0.0006;
      var spread = 0.12 + Math.sin(t * 0.004 + s) * 0.04;
      var len = base * (0.85 + Math.sin(t * 0.005 + s * 0.8) * 0.08);

      ctx.strokeStyle = "rgba(120, 165, 235, 0.16)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
      ctx.stroke();

      ctx.strokeStyle = "rgba(96, 165, 250, 0.10)";
      [-spread, spread].forEach(function (off) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(a + off) * len * 0.78,
          cy + Math.sin(a + off) * len * 0.78,
        );
        ctx.stroke();
      });

      // marcadores no fim de cada eixo
      var mx = cx + Math.cos(a) * len;
      var my = cy + Math.sin(a) * len;
      ctx.fillStyle = "rgba(210, 232, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(mx, my, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 180, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(mx, my, 6 + Math.sin(t * 0.02 + s) * 2, 0, Math.PI * 2);
      ctx.stroke();

      // arco ligando setores vizinhos
      var a2 = ((s + 1) * Math.PI * 2) / SECTORS + t * 0.0006;
      ctx.strokeStyle = "rgba(96, 165, 250, 0.13)";
      ctx.beginPath();
      ctx.arc(cx, cy, len * 0.6, a, a2);
      ctx.stroke();
    }

    // núcleo
    ctx.fillStyle = "rgba(0, 180, 255, 0.18)";
    ctx.beginPath();
    ctx.arc(cx, cy, 10 + Math.sin(t * 0.015) * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 180, 255, 0.45)";
    ctx.stroke();
  });

  /* Fundo: leque de linhas em expansão lenta */
  var bg = document.querySelector("[data-bg-canvas]");
  window.VG.canvas(bg, function (ctx, w, h, t) {
    var ox = w * 0.9;
    var oy = h * 0.15;
    for (var i = 0; i < 16; i++) {
      var a = Math.PI * 0.55 + i * 0.05 + Math.sin(t * 0.002 + i) * 0.008;
      ctx.strokeStyle =
        "rgba(120, 165, 235," +
        (0.03 + 0.02 * Math.sin(i + t * 0.004)).toFixed(3) +
        ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + Math.cos(a) * w * 1.6, oy + Math.sin(a) * h * 1.6);
      ctx.stroke();
    }
  });
})();
