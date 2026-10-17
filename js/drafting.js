/* ==========================================================================
   HSCA — DRAFTING EFFECTS
   --------------------------------------------------------------------------
   Turns the page into a live drawing:
     • a fine grid that fades in around the cursor and fades out at rest
     • a drafting crosshair with live X / Y coordinates (in mm at the
       current sheet's scale) and the frame zone (e.g. C4)
     • dimension strings drawn around hovered images, cards and headings
     • corner markers that the cursor snaps to, like a CAD endpoint snap
     • on touch screens: a survey mark where you tap
   Settings: js/config.js. Everything is drawn on one <canvas> with
   requestAnimationFrame, and the loop sleeps when nothing is moving.
   If this file fails or is removed, the site works exactly the same.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.HSCA_CONFIG || {};
  var FX = CFG.effects || {};
  var G = CFG.grid || {}, SN = CFG.snap || {}, DM = CFG.dimensions || {};
  var root = document.documentElement;
  var canvas = document.querySelector('.draft-layer');

  // Remember that the intro has played (it is pure CSS; see style.css)
  try { if ((CFG.intro || {}).oncePerSession !== false) sessionStorage.setItem('hsca-intro-seen', '1'); } catch (e) {}
  if (FX.intro === false) root.classList.add('no-intro');

  if (!canvas || FX.enabled === false || !canvas.getContext) return;

  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var finePointer = mq('(hover: hover) and (pointer: fine)');
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var touchOnly = !finePointer;
  if (touchOnly && FX.touchMarks === false) return;

  var ctx = canvas.getContext('2d');
  var dpr = 1, vw = 0, vh = 0;
  var colors = {};

  /* ---------- state ---------- */
  var mouse = { x: -999, y: -999, inside: false, last: 0, onDark: false, overLink: false, overField: false, target: null };
  var gridA = 0;                // current grid opacity 0..1
  var dim = { el: null, p: 0 }; // hovered element + draw progress
  var marks = [];               // touch survey marks
  var raf = 0;
  var snapEls = [];

  /* ---------- setup ---------- */
  function readColors() {
    var cs = getComputedStyle(root);
    colors.ink = (cs.getPropertyValue('--canvas-ink') || '20,49,91').trim();
    colors.line = (cs.getPropertyValue('--canvas-line') || '62,156,192').trim();
    colors.warm = (cs.getPropertyValue('--canvas-warm') || '214,196,0').trim();
    colors.bg = getComputedStyle(document.body).backgroundColor || '#F2F4F6';
    colors.mono = (cs.getPropertyValue('--font-mono') || 'monospace').trim();
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    vw = window.innerWidth; vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    canvas.style.width = vw + 'px'; canvas.style.height = vh + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    request();
  }
  function collect() { snapEls = Array.prototype.slice.call(document.querySelectorAll('[data-snap], [data-dim]')); }

  root.classList.add('fx-on');
  if (finePointer && FX.hideNativeCursor !== false && FX.crosshair !== false) root.classList.add('fx-cursor-none');
  readColors(); resize(); collect();
  window.addEventListener('resize', function () { resize(); });
  document.addEventListener('hsca:theme', function () { setTimeout(function () { readColors(); request(); }, 30); });
  document.addEventListener('hsca:rendered', collect);
  setTimeout(collect, 400);

  /* ---------- helpers ---------- */
  function scale() { return (window.HSCA_SHEET && window.HSCA_SHEET.scale) || 100; }
  function mm(px) { return px * (DM.pxToMm || 0.2646) * scale(); }
  function fmt(n) { return String(Math.round(n / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function rgba(c, a) { return 'rgba(' + c + ',' + a.toFixed(3) + ')'; }
  function inkC() { return mouse.onDark ? '242,244,246' : colors.ink; }
  function lineC() { return mouse.onDark ? '102,188,215' : colors.line; }
  function haloC() { return mouse.onDark ? '#0B1F3C' : colors.bg; }

  function request() { if (!raf) raf = requestAnimationFrame(frame); }

  function rectOf(el) {
    // Headings: measure the text itself, not the full-width block
    if (/^H[1-3]$/.test(el.tagName)) {
      try { var r = document.createRange(); r.selectNodeContents(el); var b = r.getBoundingClientRect(); if (b.width) return b; } catch (e) {}
    }
    return el.getBoundingClientRect();
  }

  /* ---------- input ---------- */
  if (finePointer) {
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.inside = true; mouse.last = performance.now();
      var t = e.target && e.target.closest ? e.target : null;
      mouse.onDark = !!(t && t.closest('.concepts, .site-footer'));
      mouse.overLink = !!(t && t.closest('a, button, summary, [role="button"]'));
      mouse.overField = !!(t && t.closest('input, textarea, select'));
      var d = FX.dimensionLines !== false && t ? t.closest('[data-dim]') : null;
      if (d !== dim.el) { dim.el = d; dim.p = reduced ? 1 : 0; }
      request();
    }, { passive: true });
    document.addEventListener('mouseleave', function () { mouse.inside = false; dim.el = null; request(); });
    window.addEventListener('blur', function () { mouse.inside = false; request(); });
    window.addEventListener('scroll', request, { passive: true });
  } else if (FX.touchMarks !== false) {
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      marks.push({ x: e.clientX, y: e.clientY, t: performance.now(), sx: window.scrollX, sy: window.scrollY });
      if (marks.length > 4) marks.shift();
      readColors(); request();
    }, { passive: true });
  }

  /* ---------- drawing ---------- */
  function frame(now) {
    raf = 0;
    ctx.clearRect(0, 0, vw, vh);
    var keep = false;

    if (finePointer) {
      var moving = mouse.inside && (now - mouse.last) < (G.restDelay || 900);
      if (!reduced && FX.cursorGrid !== false) {
        var target = moving && !mouse.overField ? 1 : 0;
        gridA += (target - gridA) * (target > gridA ? (G.fadeIn || 0.14) : (G.fadeOut || 0.06));
        if (Math.abs(target - gridA) > 0.01) keep = true; else gridA = target;
        if (moving) keep = true;  // keep checking so the grid can fade when the cursor rests
        if (gridA > 0.01) drawGrid();
      }

      var p = { x: mouse.x, y: mouse.y, snapped: false };
      if (mouse.inside && FX.snapPoints !== false) p = drawSnaps(p);
      if (mouse.inside && dim.el) { keep = drawDims(dim.el) || keep; }
      if (mouse.inside && !mouse.overField && FX.crosshair !== false) drawCrosshair(p);
    }

    if (marks.length) keep = drawMarks(now) || keep;
    if (keep) request();
  }

  function drawGrid() {
    var s = G.size || 24, R = G.radius || 220, major = G.majorEvery || 5;
    var a = gridA * (G.strength == null ? 0.55 : G.strength);
    var ox = -(window.scrollX % s), oy = -(window.scrollY % s);
    var firstCol = Math.floor((window.scrollX) / s), firstRow = Math.floor((window.scrollY) / s);
    var c = inkC();
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = ox; x < vw; x += s) {
      var dx = Math.abs(x - mouse.x); if (dx > R) continue;
      var h = Math.sqrt(R * R - dx * dx);
      var col = Math.round((x - ox) / s) + firstCol;
      ctx.strokeStyle = rgba(c, a * (1 - dx / R) * (col % major === 0 ? 0.55 : 0.22));
      ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, mouse.y - h); ctx.lineTo(Math.round(x) + 0.5, mouse.y + h); ctx.stroke();
    }
    for (var y = oy; y < vh; y += s) {
      var dy = Math.abs(y - mouse.y); if (dy > R) continue;
      var w = Math.sqrt(R * R - dy * dy);
      var row = Math.round((y - oy) / s) + firstRow;
      ctx.strokeStyle = rgba(c, a * (1 - dy / R) * (row % major === 0 ? 0.55 : 0.22));
      ctx.beginPath(); ctx.moveTo(mouse.x - w, Math.round(y) + 0.5); ctx.lineTo(mouse.x + w, Math.round(y) + 0.5); ctx.stroke();
    }
  }

  function drawSnaps(p) {
    var within = SN.showWithin || 170, rad = SN.radius || 18;
    var best = null, bestD = rad;
    var c = lineC();
    for (var i = 0; i < snapEls.length; i++) {
      var el = snapEls[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40 || !r.width) continue;
      // quick reject: cursor far from this box
      if (mouse.x < r.left - within || mouse.x > r.right + within || mouse.y < r.top - within || mouse.y > r.bottom + within) continue;
      var pts = [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]];
      for (var k = 0; k < 4; k++) {
        var dx = pts[k][0] - mouse.x, dy = pts[k][1] - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d > within) continue;
        var a = 0.85 * (1 - d / within);
        ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 1;
        ctx.strokeRect(Math.round(pts[k][0]) - 3.5, Math.round(pts[k][1]) - 3.5, 7, 7);
        if (d < bestD) { bestD = d; best = pts[k]; }
      }
    }
    if (best) {
      ctx.fillStyle = rgba(colors.warm, 0.95);
      ctx.strokeStyle = rgba(inkC(), 0.9);
      ctx.fillRect(Math.round(best[0]) - 5, Math.round(best[1]) - 5, 10, 10);
      ctx.strokeRect(Math.round(best[0]) - 5.5, Math.round(best[1]) - 5.5, 11, 11);
      return { x: best[0], y: best[1], snapped: true };
    }
    return p;
  }

  function tick(x, y) { ctx.moveTo(x - 4, y + 4); ctx.lineTo(x + 4, y - 4); }

  function drawDims(el) {
    var r = rectOf(el);
    if (r.bottom < 0 || r.top > vh || !r.width) return false;
    if (dim.p < 1) dim.p = Math.min(1, dim.p + (DM.drawSpeed || 0.12) * (1.4 - dim.p));
    var p = dim.p, off = DM.offset || 16, c = lineC();
    ctx.strokeStyle = rgba(c, 0.95); ctx.fillStyle = rgba(c, 1); ctx.lineWidth = 1;

    // width string, above (or below if there is no room)
    var y = r.top - off > 76 ? r.top - off : r.bottom + off;
    var cx = (r.left + r.right) / 2, half = (r.width / 2) * p;
    ctx.beginPath();
    ctx.moveTo(cx - half, y + 0.5); ctx.lineTo(cx + half, y + 0.5);
    var ey = y < r.top ? -1 : 1;  // extension lines
    ctx.moveTo(r.left + 0.5, y + ey * 5); ctx.lineTo(r.left + 0.5, y < r.top ? r.top - 3 : r.bottom + 3);
    ctx.moveTo(r.right - 0.5, y + ey * 5); ctx.lineTo(r.right - 0.5, y < r.top ? r.top - 3 : r.bottom + 3);
    if (p > 0.98) { tick(r.left, y); tick(r.right, y); }
    ctx.stroke();

    // height string, left (or right if there is no room)
    var x = r.left - off > 20 ? r.left - off : r.right + off;
    var cy = (r.top + r.bottom) / 2, halfH = (r.height / 2) * p;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, cy - halfH); ctx.lineTo(x + 0.5, cy + halfH);
    var ex = x < r.left ? -1 : 1;
    ctx.moveTo(x + ex * 5, r.top + 0.5); ctx.lineTo(x < r.left ? r.left - 3 : r.right + 3, r.top + 0.5);
    ctx.moveTo(x + ex * 5, r.bottom - 0.5); ctx.lineTo(x < r.left ? r.left - 3 : r.right + 3, r.bottom - 0.5);
    if (p > 0.98) { tick(x, r.top); tick(x, r.bottom); }
    ctx.stroke();

    if (p > 0.6) {
      ctx.globalAlpha = Math.min(1, (p - 0.6) / 0.4);
      ctx.font = '500 11px ' + colors.mono;
      label(fmt(mm(r.width)), cx, y - 5, 'center');
      ctx.save(); ctx.translate(x - 5, cy); ctx.rotate(-Math.PI / 2); label(fmt(mm(r.height)), 0, 0, 'center'); ctx.restore();
      ctx.globalAlpha = 1;
    }
    return p < 1;
  }

  function label(text, x, y, align) {
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = haloC();
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.lineWidth = 1;
  }

  function drawCrosshair(p) {
    var c = inkC(), x = Math.round(p.x) + 0.5, y = Math.round(p.y) + 0.5;
    // long hairlines across the sheet
    ctx.strokeStyle = rgba(c, 0.12); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(vw, y); ctx.moveTo(x, 0); ctx.lineTo(x, vh); ctx.stroke();
    // the cursor itself: a short cross with a gap
    ctx.strokeStyle = rgba(c, 0.95);
    ctx.beginPath();
    ctx.moveTo(x - 14, y); ctx.lineTo(x - 4, y); ctx.moveTo(x + 4, y); ctx.lineTo(x + 14, y);
    ctx.moveTo(x, y - 14); ctx.lineTo(x, y - 4); ctx.moveTo(x, y + 4); ctx.lineTo(x, y + 14);
    ctx.stroke();
    if (mouse.overLink) {
      // spire: a small upright triangle marks something you can click
      ctx.fillStyle = rgba(colors.warm, 1); ctx.strokeStyle = rgba(c, 0.9);
      ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x + 5, y + 4); ctx.lineTo(x - 5, y + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillStyle = rgba(c, 1); ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    }

    if (FX.coordinates === false) return;
    var zone = 'ABCDEF'.charAt(Math.min(5, Math.floor(p.y / (vh / 6)))) + (Math.min(7, Math.floor(p.x / (vw / 8))) + 1);
    var lx = p.x + 18, ly = p.y + 30, flip = lx > vw - 170;
    ctx.font = '500 10.5px ' + colors.mono;
    ctx.fillStyle = rgba(c, 0.95);
    var l1 = 'X ' + fmt(mm(p.x + window.scrollX)) + '   Y ' + fmt(mm(p.y + window.scrollY));
    var l2 = (p.snapped ? 'END  ' : '') + zone + '  ·  ' + ((window.HSCA_SHEET && window.HSCA_SHEET.scale > 1) ? '1:' + window.HSCA_SHEET.scale : 'NTS');
    if (flip) { lx = p.x - 18; }
    label(l1, lx, ly, flip ? 'right' : 'left');
    ctx.fillStyle = rgba(lineC(), 1);
    label(l2, lx, ly + 14, flip ? 'right' : 'left');
  }

  function drawMarks(now) {
    var alive = false;
    ctx.font = '500 10.5px ' + colors.mono;
    for (var i = marks.length - 1; i >= 0; i--) {
      var m = marks[i], t = (now - m.t) / 1100;
      if (t >= 1) { marks.splice(i, 1); continue; }
      alive = true;
      var a = reduced ? 1 - t : (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85);
      var x = m.x - (window.scrollX - m.sx), y = m.y - (window.scrollY - m.sy);
      var r = reduced ? 12 : 8 + 8 * Math.min(1, t * 3);
      ctx.strokeStyle = rgba(colors.line, a); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.moveTo(x - r - 6, y); ctx.lineTo(x + r + 6, y); ctx.moveTo(x, y - r - 6); ctx.lineTo(x, y + r + 6);
      ctx.stroke();
      ctx.fillStyle = rgba(colors.ink, a);
      var flip = x > vw - 150;
      label('X ' + fmt(mm(m.x + m.sx)) + '  Y ' + fmt(mm(m.y + m.sy)), flip ? x - 22 : x + 22, y - 14, flip ? 'right' : 'left');
    }
    return alive;
  }
})();
