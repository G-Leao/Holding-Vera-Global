/* HOME — Globo digital / rede global (Canvas 2D, vanilla JS) */
(function () {
  "use strict";
  var P = window.VG.palette;

  /* ---------- Hero: globo institucional ---------- */
  var hero = document.querySelector("[data-hero-canvas]");

  // Pontos estratégicos (lat/long fictícios apenas como geometria visual)
  var nodes = [
    [-23.5, -46.6],
    [40.7, -74.0],
    [51.5, -0.12],
    [35.6, 139.7],
    [25.2, 55.3],
    [-33.9, 18.4],
    [1.35, 103.8],
    [48.85, 2.35],
    [-34.6, -58.4],
    [19.4, -99.1],
    [-15.8, -47.9],
    [37.5, 127.0],
  ];

  var arcs = [
    [0, 2],
    [0, 1],
    [2, 4],
    [4, 6],
    [1, 9],
    [3, 6],
    [7, 5],
    [0, 10],
    [2, 7],
    [4, 11],
  ];

  function project(latDeg, lonDeg, rot, R, cx, cy) {
    var lat = (latDeg * Math.PI) / 180;
    var lon = (lonDeg * Math.PI) / 180 + rot;
    var x = Math.cos(lat) * Math.sin(lon);
    var y = Math.sin(lat);
    var z = Math.cos(lat) * Math.cos(lon);
    return { x: cx + x * R, y: cy - y * R, z: z };
  }

  window.VG.canvas(hero, function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var R = Math.min(w, h) * 0.36;
    var rot = t * 0.0016; // rotação muito lenta

    // halo sutil
    var glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
    glow.addColorStop(0, "rgba(37, 99, 235, 0.16)");
    glow.addColorStop(1, "rgba(37, 99, 235, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // esfera
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(120, 165, 235, 0.22)";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // paralelos (latitude)
    for (var lat = -60; lat <= 60; lat += 20) {
      var rad = (lat * Math.PI) / 180;
      var ry = Math.abs(Math.cos(rad) * R * 0.28);
      ctx.strokeStyle = lat === 0 ? P.lineSoft : "rgba(120, 165, 235, 0.10)";
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy - Math.sin(rad) * R,
        Math.cos(rad) * R,
        ry,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }

    // meridianos (longitude)
    for (var m = 0; m < 12; m++) {
      var ang = rot + (m * Math.PI) / 6;
      var rx = Math.abs(Math.sin(ang)) * R;
      ctx.strokeStyle = "rgba(120, 165, 235, 0.10)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // projeção dos pontos
    var pts = nodes.map(function (n) {
      return project(n[0], n[1], rot, R, cx, cy);
    });

    // arcos de conexão sobre a superfície
    arcs.forEach(function (a, i) {
      var p1 = pts[a[0]];
      var p2 = pts[a[1]];
      if (p1.z < -0.15 && p2.z < -0.15) return;
      var mx = (p1.x + p2.x) / 2;
      var my = (p1.y + p2.y) / 2;
      var lift = 0.22;
      var ccx = cx + (mx - cx) * (1 + lift);
      var ccy = cy + (my - cy) * (1 + lift);
      var depth = Math.max(0.06, (p1.z + p2.z) / 2 + 0.4);
      ctx.strokeStyle =
        "rgba(96, 165, 250," + (0.1 + depth * 0.24).toFixed(3) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(ccx, ccy, p2.x, p2.y);
      ctx.stroke();

      // pulso lento percorrendo o arco
      var prog = (t * 0.0022 + i * 0.17) % 1;
      var inv = 1 - prog;
      var px = inv * inv * p1.x + 2 * inv * prog * ccx + prog * prog * p2.x;
      var py = inv * inv * p1.y + 2 * inv * prog * ccy + prog * prog * p2.y;
      ctx.fillStyle = "rgba(0, 180, 255," + (0.5 * depth).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // pontos estratégicos
    pts.forEach(function (p, i) {
      if (p.z < -0.1) return;
      var vis = Math.max(0, p.z);
      var pulse = 1 + Math.sin(t * 0.02 + i) * 0.25;
      ctx.fillStyle =
        "rgba(220, 238, 255," + (0.25 + vis * 0.6).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      if (vis > 0.55) {
        ctx.strokeStyle = "rgba(0, 180, 255," + (0.18 * vis).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 + pulse * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  });

  /* ---------- Fundo da Home: malha global à deriva ---------- */
  var bg = document.querySelector("[data-bg-canvas]");
  window.VG.canvas(bg, function (ctx, w, h, t) {
    var step = 120;
    var drift = (t * 0.12) % step;
    ctx.strokeStyle = "rgba(120, 165, 235, 0.05)";
    ctx.lineWidth = 1;
    for (var x = -step + drift; x < w + step; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h * 0.12, h);
      ctx.stroke();
    }
    for (var y = 0; y < h + step; y += step) {
      var o = 0.03 + 0.02 * Math.sin(t * 0.004 + y * 0.01);
      ctx.strokeStyle = "rgba(120, 165, 235," + o.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });
})();
