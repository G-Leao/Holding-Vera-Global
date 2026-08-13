/* SOBRE — Arquitetura institucional em camadas (Canvas 2D) */
(function () {
  "use strict";

  var hero = document.querySelector("[data-hero-canvas]");

  window.VG.canvas(hero, function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var base = Math.min(w, h) * 0.34;
    var layers = 5;

    var glow = ctx.createRadialGradient(cx, cy, base * 0.1, cx, cy, base * 1.7);
    glow.addColorStop(0, "rgba(37, 99, 235, 0.14)");
    glow.addColorStop(1, "rgba(37, 99, 235, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Camadas isométricas: estrutura, governança e crescimento
    for (var i = 0; i < layers; i++) {
      var p = i / (layers - 1);
      var breathe = Math.sin(t * 0.006 + i * 0.6) * base * 0.02;
      var r = base * (1 - p * 0.42);
      var y = cy + (p - 0.5) * base * 1.15 + breathe;
      var ry = r * 0.34;

      ctx.lineWidth = 1;
      ctx.strokeStyle =
        "rgba(120, 165, 235," + (0.1 + (1 - p) * 0.18).toFixed(3) + ")";
      ctx.beginPath();
      ctx.ellipse(cx, y, r, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      // preenchimento sutil
      var g = ctx.createLinearGradient(cx - r, y, cx + r, y);
      g.addColorStop(0, "rgba(26, 95, 180, 0)");
      g.addColorStop(
        0.5,
        "rgba(26, 95, 180," + (0.07 * (1 - p) + 0.02).toFixed(3) + ")",
      );
      g.addColorStop(1, "rgba(26, 95, 180, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, y, r, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // colunas verticais entre camadas
      if (i < layers - 1) {
        var nextP = (i + 1) / (layers - 1);
        var nextR = base * (1 - nextP * 0.42);
        var nextY =
          cy +
          (nextP - 0.5) * base * 1.15 +
          Math.sin(t * 0.006 + (i + 1) * 0.6) * base * 0.02;
        for (var k = 0; k < 6; k++) {
          var a = (k * Math.PI) / 3 + t * 0.0012;
          ctx.strokeStyle = "rgba(120, 165, 235, 0.08)";
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * r, y + Math.sin(a) * ry);
          ctx.lineTo(
            cx + Math.cos(a) * nextR,
            nextY + Math.sin(a) * nextR * 0.34,
          );
          ctx.stroke();
        }
      }

      // nós de governança
      for (var n = 0; n < 6; n++) {
        var ang = (n * Math.PI) / 3 + t * 0.0012;
        var nx = cx + Math.cos(ang) * r;
        var ny = y + Math.sin(ang) * ry;
        var alpha = 0.25 + 0.35 * ((Math.sin(ang) + 1) / 2);
        ctx.fillStyle = "rgba(200, 228, 255," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(nx, ny, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // eixo central — visão de longo prazo
    var pulse = (t * 0.004) % 1;
    var axisTop = cy - base * 0.72;
    var axisBottom = cy + base * 0.72;
    var lg = ctx.createLinearGradient(0, axisTop, 0, axisBottom);
    lg.addColorStop(0, "rgba(0, 180, 255, 0)");
    lg.addColorStop(0.5, "rgba(0, 180, 255, 0.28)");
    lg.addColorStop(1, "rgba(0, 180, 255, 0)");
    ctx.strokeStyle = lg;
    ctx.beginPath();
    ctx.moveTo(cx, axisTop);
    ctx.lineTo(cx, axisBottom);
    ctx.stroke();

    ctx.fillStyle = "rgba(0, 180, 255, 0.75)";
    ctx.beginPath();
    ctx.arc(
      cx,
      axisBottom - pulse * (axisBottom - axisTop),
      2.2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  });

  /* Fundo: estratos horizontais lentos */
  var bg = document.querySelector("[data-bg-canvas]");
  window.VG.canvas(bg, function (ctx, w, h, t) {
    for (var i = 0; i < 14; i++) {
      var y = ((i * 90 + t * 0.16) % (h + 120)) - 60;
      var o = 0.02 + 0.025 * Math.sin(i * 0.9 + t * 0.003);
      ctx.strokeStyle = "rgba(120, 165, 235," + Math.max(o, 0).toFixed(3) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y - w * 0.03);
      ctx.stroke();
    }
  });
})();
