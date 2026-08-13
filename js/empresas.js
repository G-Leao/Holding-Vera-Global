/* EMPRESAS — Ecossistema empresarial: nós, órbitas e conexões */
(function () {
  "use strict";

  var hero = document.querySelector("[data-hero-canvas]");

  var orbits = [
    { r: 0.42, count: 3, speed: 0.0018 },
    { r: 0.62, count: 4, speed: -0.0012 },
    { r: 0.82, count: 5, speed: 0.0008 },
  ];

  window.VG.canvas(hero, function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var base = Math.min(w, h) * 0.4;

    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.4);
    glow.addColorStop(0, "rgba(37, 99, 235, 0.2)");
    glow.addColorStop(1, "rgba(37, 99, 235, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // núcleo — a holding
    var corePulse = 1 + Math.sin(t * 0.014) * 0.08;
    ctx.strokeStyle = "rgba(0, 180, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 12 * corePulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(0, 180, 255, 0.16)";
    ctx.fill();

    var all = [];
    orbits.forEach(function (o, oi) {
      var r = base * o.r;
      ctx.strokeStyle = "rgba(120, 165, 235, 0.10)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      for (var i = 0; i < o.count; i++) {
        var a = t * o.speed + (i * Math.PI * 2) / o.count + oi;
        var x = cx + Math.cos(a) * r;
        var y = cy + Math.sin(a) * r * 0.86;
        all.push({ x: x, y: y, oi: oi });

        // conexão com o núcleo
        ctx.strokeStyle = "rgba(120, 165, 235, 0.10)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        var size = oi === 0 ? 4.5 : 3.2;
        ctx.fillStyle = "rgba(200, 228, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 180, 255, 0.22)";
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          size + 5 + Math.sin(t * 0.02 + i + oi) * 2,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    });

    // sinergias entre nós próximos
    for (var i2 = 0; i2 < all.length; i2++) {
      for (var j = i2 + 1; j < all.length; j++) {
        var dx = all[i2].x - all[j].x;
        var dy = all[i2].y - all[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d > base * 0.62) continue;
        ctx.strokeStyle =
          "rgba(96, 165, 250," +
          (0.16 * (1 - d / (base * 0.62))).toFixed(3) +
          ")";
        ctx.beginPath();
        ctx.moveTo(all[i2].x, all[i2].y);
        ctx.lineTo(all[j].x, all[j].y);
        ctx.stroke();
      }
    }
  });

  /* Fundo: constelação corporativa muito discreta */
  var bg = document.querySelector("[data-bg-canvas]");
  var stars = [];
  window.VG.canvas(
    bg,
    function (ctx, w, h, t) {
      stars.forEach(function (s, i) {
        var x = (s.x + t * s.v) % (w + 40);
        var y = s.y * h;
        ctx.fillStyle =
          "rgba(160, 200, 255," +
          (0.06 + 0.06 * Math.sin(t * 0.01 + i)).toFixed(3) +
          ")";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    {
      onResize: function (w) {
        stars = [];
        var count = window.VG.lowPower ? 26 : 48;
        for (var i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * (w + 40),
            y: Math.random(),
            r: Math.random() * 1.2 + 0.4,
            v: Math.random() * 0.06 + 0.02,
          });
        }
      },
    },
  );
})();
