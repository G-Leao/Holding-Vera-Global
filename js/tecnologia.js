/* TECNOLOGIA — hero de rede de dados + fundo discreto */
(function () {
  "use strict";
  var hero = document.querySelector("[data-hero-canvas]");
  var bg = document.querySelector("[data-bg-canvas]");
  if (!window.VG || !window.VG.canvas) return;

  if (hero) {
    var nodes = [];
    var paths = [];

    window.VG.canvas(hero, {
      init: function (ctx, w, h) {
        nodes = [];
        paths = [];

        var cx = w / 2;
        var cy = h / 2;
        var r = Math.min(w, h) * 0.33;
        var count = 14;

        for (var i = 0; i < count; i++) {
          var angle = (Math.PI * 2 * i) / count + Math.PI / 6;
          var nx = cx + Math.cos(angle) * (r * (0.6 + Math.random() * 0.9));
          var ny = cy + Math.sin(angle) * (r * (0.6 + Math.random() * 0.9));
          nodes.push({ x: nx, y: ny, size: 1.2 + Math.random() * 2.2 });
        }

        for (var i = 0; i < 6; i++) {
          var edgeX = Math.random() * w;
          var edgeY = Math.random() * h;
          nodes.push({ x: edgeX, y: edgeY, size: 1.1 + Math.random() * 1.4 });
        }

        for (var i = 0; i < nodes.length; i++) {
          for (var j = i + 1; j < nodes.length; j++) {
            var dx = nodes[i].x - nodes[j].x;
            var dy = nodes[i].y - nodes[j].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < Math.min(w, h) * 0.6) {
              paths.push({
                a: nodes[i],
                b: nodes[j],
                pulse: Math.random(),
                speed: 0.0015 + Math.random() * 0.0028,
              });
            }
          }
        }
      },
      frame: function (ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);

        var cx = w / 2;
        var cy = h / 2;

        for (var i = 0; i < paths.length; i++) {
          var p = paths[i];
          var alpha = 0.08 + 0.14 * Math.sin(t * p.speed + p.pulse * 14);
          ctx.strokeStyle = "rgba(125, 196, 255, " + alpha + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.a.x, p.a.y);
          ctx.lineTo(p.b.x, p.b.y);
          ctx.stroke();

          var pulse = (Math.sin(t * 0.003 + p.pulse * 12) + 1) * 0.5;
          var px = p.a.x + (p.b.x - p.a.x) * pulse;
          var py = p.a.y + (p.b.y - p.a.y) * pulse;
          var grad = ctx.createRadialGradient(px, py, 0, px, py, 12);
          grad.addColorStop(0, "rgba(100, 220, 255, 0.8)");
          grad.addColorStop(1, "rgba(100, 220, 255, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, 12, 0, Math.PI * 2);
          ctx.fill();
        }

        var centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.42);
        centerGlow.addColorStop(0, "rgba(84, 176, 255, 0.18)");
        centerGlow.addColorStop(1, "rgba(84, 176, 255, 0)");
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, w, h);

        for (var n = 0; n < nodes.length; n++) {
          var node = nodes[n];
          var pulse = 1.2 + Math.sin(t * 0.0014 + n) * 0.7;
          ctx.fillStyle = "rgba(190, 225, 255, 0.78)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - 36);
        ctx.strokeStyle = "rgba(120, 200, 255, 0.18)";
        ctx.stroke();
      },
    });
  }

  if (bg) {
    var lines = [];
    window.VG.canvas(bg, {
      init: function (ctx, w, h) {
        lines = [];
        for (var i = 0; i < 18; i++) {
          lines.push({
            y: Math.random() * h,
            len: 120 + Math.random() * 280,
            x: Math.random() * w,
            v: 0.04 + Math.random() * 0.12,
            alpha: 0.04 + Math.random() * 0.06,
          });
        }
      },
      frame: function (ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1;
        for (var i = 0; i < lines.length; i++) {
          var l = lines[i];
          l.x += l.v;
          if (l.x - l.len > w) l.x = -l.len;
          var grad = ctx.createLinearGradient(l.x - l.len, l.y, l.x, l.y);
          grad.addColorStop(0, "rgba(0,180,255,0)");
          grad.addColorStop(0.5, "rgba(0,180,255," + l.alpha + ")");
          grad.addColorStop(1, "rgba(0,180,255,0)");
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(l.x - l.len, l.y);
          ctx.lineTo(l.x, l.y);
          ctx.stroke();
        }
      },
    });
  }
})();
