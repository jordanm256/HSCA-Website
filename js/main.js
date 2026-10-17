/* ==========================================================================
   HSCA — MAIN SCRIPT
   Draws the project / concept / journal sheets from js/data.js, runs the
   menu, the title block, the theme switch and the enquiry form.
   The page still reads correctly if this file fails: all fixed copy is in
   index.html.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.HSCA_CONFIG || {};
  var DATA = window.HSCA_DATA || { projects: [], concepts: [], journal: [] };
  var CONTACT = CFG.contact || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- small helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* Text starting with [PLACEHOLDER ...] is shown as a yellow "hold" note */
  function txt(s) {
    s = esc(s);
    return /^\[PLACEHOLDER/i.test(s) ? '<span class="hold">' + s + '</span>' : s;
  }
  function isHold(s) { return /^\[PLACEHOLDER/i.test(String(s || '')); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------- linework drawings shown over project and concept images ----
     Simple line drawings in a 400 x 300 box. Add your own type here.     */
  var LINEWORK = {
    kitchen:
      '<path class="lw-draw" pathLength="1" d="M70 50H330V250H70Z"/>' +
      '<path class="lw-draw" pathLength="1" d="M70 50H300V86H106V214H70"/>' +
      '<path class="lw-draw" pathLength="1" d="M168 120H262V172H168Z"/>' +
      '<path class="lw-draw" pathLength="1" d="M300 50H330V92H300Z M300 50L330 92"/>' +
      '<path class="lw-draw" pathLength="1" d="M330 250V200M285 250A45 45 0 0 1 330 205"/>' +
      '<path class="lw-draw lw-dim" pathLength="1" d="M70 32H330M70 26V38M330 26V38"/>' +
      '<path class="lw-draw lw-dim" pathLength="1" d="M52 50V250M46 50H58M46 250H58"/>' +
      '<text x="200" y="26" text-anchor="middle">3 600</text>',
    bathroom:
      '<path class="lw-draw" pathLength="1" d="M110 50H290V250H110Z"/>' +
      '<path class="lw-draw" pathLength="1" d="M110 50H190V130H110Z M110 50L190 130 M190 50L110 130"/>' +
      '<path class="lw-draw" pathLength="1" d="M246 62H278V96H246Z M262 96C246 110 246 132 262 140C278 132 278 110 262 96"/>' +
      '<path class="lw-draw" pathLength="1" d="M230 238H286V206H230Z"/>' +
      '<path class="lw-draw" pathLength="1" d="M110 250V200M160 250A50 50 0 0 0 110 200"/>' +
      '<path class="lw-draw lw-dim" pathLength="1" d="M110 32H290M110 26V38M290 26V38"/>' +
      '<text x="200" y="26" text-anchor="middle">2 400</text>',
    house:
      '<path class="lw-draw" pathLength="1" d="M60 240H340"/>' +
      '<path class="lw-draw" pathLength="1" d="M90 240V150H310V240"/>' +
      '<path class="lw-draw" pathLength="1" d="M80 152L200 60L320 152"/>' +
      '<path class="lw-draw" pathLength="1" d="M200 60V30M192 40L200 22L208 40"/>' +
      '<path class="lw-draw" pathLength="1" d="M130 240V190H170V240M220 175H280V205H220Z"/>' +
      '<path class="lw-draw lw-dim" pathLength="1" d="M350 240V60M344 240H356M344 60H356"/>' +
      '<text x="372" y="154" text-anchor="middle">7 200</text>',
    section:
      '<path class="lw-draw" pathLength="1" d="M50 250H350M50 262H350"/>' +
      '<path class="lw-draw" pathLength="1" d="M80 250V120H320V250"/>' +
      '<path class="lw-draw" pathLength="1" d="M70 122L200 70L330 122"/>' +
      '<path class="lw-draw" pathLength="1" d="M80 185H320M150 185V250M250 120V185"/>' +
      '<path class="lw-draw" pathLength="1" d="M95 250V225H135V250M265 210H305V235H265Z"/>' +
      '<path class="lw-draw lw-dim" pathLength="1" d="M30 250V120M24 250H36M24 120H36"/>' +
      '<text x="200" y="30" text-anchor="middle">SECTION A–A</text>'
  };
  function linework(type) {
    return '<svg class="linework" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' +
      (LINEWORK[type] || LINEWORK.section) + '</svg>';
  }

  function figure(item, cls) {
    var hasImg = item.image && !isHold(item.image);
    var alt = isHold(item.imageAlt) ? (item.title || 'Project photograph') : item.imageAlt;
    return '<figure class="' + cls + ' ' + (hasImg ? 'has-image' : 'no-image') + '" data-dim data-snap>' +
      (hasImg ? '<img src="' + esc(item.image) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' : '') +
      linework(item.plan) +
      (hasImg ? '' : '<span class="hold">[PLACEHOLDER: ' + (cls.indexOf('concept') > -1 ? 'drawing or render' : 'project photo') + ']</span>') +
      '</figure>';
  }

  /* ---------- A-401 built work ---------- */
  function renderProjects() {
    var host = $('[data-projects]'); if (!host) return;
    var list = DATA.projects || [];
    var html = list.map(function (p, i) {
      var no = 'A-4' + pad(i + 2);       // A-401 is the sheet itself, projects start at A-402
      var live = /site/i.test(p.status || '');
      return '<article class="project' + (p.featured ? ' project--featured' : '') + '" data-type="' + esc(p.type) + '">' +
        figure(p, 'project__figure') +
        '<div class="project__body">' +
          '<span class="project__no">' + no + '</span>' +
          '<h3 class="project__title">' + txt(p.title) + '</h3>' +
          '<p class="project__meta"><span>' + txt(p.type) + '</span><span>' + txt(p.place) + '</span><span>' + txt(p.year) + '</span></p>' +
          '<p class="project__summary">' + txt(p.summary) + '</p>' +
          '<div class="project__scope">' +
            (p.status ? '<span class="chip ' + (live ? 'chip--live' : 'chip--status') + '">' + esc(p.status) + '</span>' : '') +
            (p.scope || []).map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    // The next, still-empty sheet: invites the visitor to become a project.
    // Let the open sheet fill the rest of its row (3 columns on desktop, 2 on tablets)
    var used = list.length + list.filter(function (p) { return p.featured; }).length;
    var span3 = 3 - (used % 3), span2 = 2 - (used % 2);
    var nextNo = 'A-4' + pad(list.length + 2);
    html += '<article class="project project--next" style="--span3:' + span3 + ';--span2:' + span2 + '">' +
      '<a class="project__figure" href="#enquire" data-snap data-dim>' +
        '<span class="project__next-in">' +
          '<span class="chip">Sheet ' + nextNo + ' &middot; not yet drawn</span>' +
          '<strong>Your kitchen or bathroom could be the next sheet.</strong>' +
          '<span>Start with a visit and a measured survey.</span>' +
        '</span>' +
      '</a>' +
    '</article>';
    host.innerHTML = html;

    var count = $('[data-count="projects"]');
    if (count) count.textContent = 'Register · ' + pad(list.length) + ' sheet' + (list.length === 1 ? '' : 's');

    // Filters appear only once the register is big enough to need them
    var filterHost = $('[data-filters]');
    var types = [];
    list.forEach(function (p) { if (p.type && types.indexOf(p.type) < 0) types.push(p.type); });
    if (filterHost && list.length >= ((CFG.projects || {}).filterFrom || 6) && types.length > 1) {
      filterHost.innerHTML = ['All'].concat(types).map(function (t, i) {
        return '<button type="button" aria-pressed="' + (i === 0) + '" data-filter="' + esc(t) + '">' + esc(t) + '</button>';
      }).join('');
      filterHost.hidden = false;
      filterHost.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', filterHost).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        var f = b.getAttribute('data-filter');
        $$('.project[data-type]', host).forEach(function (card) {
          card.hidden = !(f === 'All' || card.getAttribute('data-type') === f);
        });
      });
    }
  }

  /* ---------- A-501 concepts ---------- */
  function renderConcepts() {
    var host = $('[data-concepts]'); if (!host) return;
    host.innerHTML = (DATA.concepts || []).map(function (c, i) {
      return '<article class="concept">' +
        figure(c, 'concept__figure') +
        '<div class="concept__body">' +
          '<span class="stamp">Concept &middot; unbuilt</span>' +
          '<p class="eyebrow">A-5' + pad(i + 2) + ' &middot; ' + txt(c.type) + ' &middot; ' + txt(c.place) + ' &middot; ' + txt(c.year) + '</p>' +
          '<h3 class="concept__title">' + (isHold(c.title) ? 'Concept ' + pad(i + 1) + ' ' + txt(c.title) : txt(c.title)) + '</h3>' +
          '<p class="concept__q">' + txt(c.question) + '</p>' +
          '<p>' + txt(c.summary) + '</p>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------- A-701 journal ---------- */
  function renderJournal() {
    var host = $('[data-journal]'); if (!host) return;
    host.innerHTML = (DATA.journal || []).map(function (j) {
      var body = j.body || [];
      var d = new Date(j.date + 'T00:00:00');
      var date = isNaN(d) ? esc(j.date) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return '<article class="entry" data-snap>' +
        '<p class="entry__meta"><span>' + esc(j.tag || 'Note') + ' &middot; <time datetime="' + esc(j.date) + '">' + date + '</time></span>' +
          (j.status ? '<span class="entry__stamp">' + esc(j.status) + '</span>' : '') + '</p>' +
        '<h3 class="entry__title" data-dim>' + txt(j.title) + '</h3>' +
        '<p class="entry__lede">' + txt(body[0] || '') + '</p>' +
        (body.length > 1 ? '<details><summary>Read the rest</summary>' + body.slice(1).map(function (p) { return '<p>' + txt(p) + '</p>'; }).join('') + '</details>' : '') +
      '</article>';
    }).join('');
  }

  /* ---------- menu (phones) ---------- */
  function initMenu() {
    var btn = $('.nav__toggle'), list = $('#nav-list');
    if (!btn || !list) return;
    function set(open) {
      btn.setAttribute('aria-expanded', open);
      list.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && list.classList.contains('is-open')) { set(false); btn.focus(); } });
  }

  /* ---------- title block: current sheet, scale and progress ---------- */
  var current = null;
  window.HSCA_SHEET = { scale: 100, sheet: 'A-000' };   // read by drafting.js
  function initTitleBlock() {
    var sheets = $$('.sheet[data-sheet]');
    var total = sheets.length;
    $$('[data-tb="total"]').forEach(function (el) { el.textContent = pad(total); });
    var now = new Date();
    $$('[data-tb="date"]').forEach(function (el) { el.textContent = now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); });
    $$('[data-year]').forEach(function (el) { el.textContent = now.getFullYear(); });
    var navLinks = $$('.nav__list a');

    function setSheet(s) {
      if (s === current) return;
      current = s;
      var scale = parseInt(s.getAttribute('data-scale'), 10);
      var scaleText = scale ? '1:' + scale : 'NTS';
      window.HSCA_SHEET = { scale: scale || 1, sheet: s.getAttribute('data-sheet') };
      $$('[data-tb="sheet"]').forEach(function (el) { el.textContent = s.getAttribute('data-sheet'); });
      $$('[data-tb="title"]').forEach(function (el) { el.textContent = s.getAttribute('data-title'); });
      $$('[data-tb="scale"]').forEach(function (el) { el.textContent = scaleText; });
      $$('[data-tb="index"]').forEach(function (el) { el.textContent = pad(sheets.indexOf(s) + 1); });
      navLinks.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + s.id ? 'true' : 'false'); });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var mid = window.innerHeight * 0.35, pick = sheets[0];
        for (var i = 0; i < sheets.length; i++) { if (sheets[i].getBoundingClientRect().top <= mid) pick = sheets[i]; }
        setSheet(pick);
        var max = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- paper / blueprint switch ---------- */
  function initTheme() {
    var root = document.documentElement;
    function effective() {
      var t = root.getAttribute('data-theme');
      if (t) return t;
      return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function label() {
      $$('[data-tb="theme"]').forEach(function (el) { el.textContent = effective() === 'dark' ? 'Blueprint' : 'Paper'; });
      document.dispatchEvent(new CustomEvent('hsca:theme'));
    }
    $$('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var next = effective() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('hsca-theme', next); } catch (e) {}
        label();
      });
    });
    if (window.matchMedia) { try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', label); } catch (e) {} }
    label();
  }

  /* ---------- contact links + enquiry form ---------- */
  function initContact() {
    var wa = 'https://wa.me/' + (CONTACT.whatsapp || '256700790451');
    $$('[data-wa]').forEach(function (a) { a.href = wa; });

    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-copy');
        function done(ok) { b.textContent = ok ? 'Copied' : 'Select'; setTimeout(function () { b.textContent = 'Copy'; }, 1800); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(v).then(function () { done(true); }, function () { selectText(b.previousElementSibling); done(false); });
        } else { selectText(b.previousElementSibling); done(false); }
      });
    });
    function selectText(el) {
      if (!el) return;
      try { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
    }

    var form = $('#enquiry-form'); if (!form) return;
    var err = $('.form__error', form), note = $('.form__note', form);
    var lastSubmitter = null;
    $$('button[type="submit"]', form).forEach(function (b) { b.addEventListener('click', function () { lastSubmitter = b; }); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var sub = e.submitter || lastSubmitter;
      var via = sub ? sub.getAttribute('data-send') : 'whatsapp';
      var f = form.elements;
      var missing = [];
      ['name', 'phone'].forEach(function (k) {
        var bad = !f[k].value.trim();
        f[k].setAttribute('aria-invalid', bad);
        if (bad) missing.push(f[k].labels && f[k].labels[0] ? f[k].labels[0].textContent : k);
      });
      if (missing.length) {
        err.textContent = 'Please add: ' + missing.join(' and ') + '. We need these to reply to you.';
        err.hidden = false;
        f[missing.length && !f.name.value.trim() ? 'name' : 'phone'].focus();
        return;
      }
      err.hidden = true;
      var msg = 'Hello HSCA, I would like to talk about a project.\n\n' +
        'Name: ' + f.name.value.trim() + '\n' +
        'Phone: ' + f.phone.value.trim() + '\n' +
        (f.area.value.trim() ? 'Area: ' + f.area.value.trim() + '\n' : '') +
        'Project: ' + f.type.value + '\n' +
        (f.message.value.trim() ? '\n' + f.message.value.trim() + '\n' : '');
      var url = via === 'email'
        ? 'mailto:' + (CONTACT.email || 'karibu@hsca.studio') + '?subject=' + encodeURIComponent('Enquiry: ' + f.type.value) + '&body=' + encodeURIComponent(msg)
        : wa + '?text=' + encodeURIComponent(msg);
      // Try to open the app straight away, and always leave a real link as a fallback.
      try { if (via === 'email') window.location.href = url; else window.open(url, '_blank', 'noopener'); } catch (x) {}
      note.innerHTML = via === 'email'
        ? 'Your message is written out. <a href="' + esc(url) + '">Open it in your email app</a>, or write to ' + esc(CONTACT.email || 'karibu@hsca.studio') + '. Nothing is sent until you press send there.'
        : 'Your message is written out. <a href="' + esc(url) + '" target="_blank" rel="noopener">Open it in WhatsApp</a> and press send to reach us on ' + esc(CONTACT.phoneDisplay || '+256 700 790 451') + '.';
    });
  }

  /* ---------- phones: show linework on the project card in the middle of the screen */
  function initActiveCards() {
    if (!('IntersectionObserver' in window)) return;
    if (!window.matchMedia('(hover: none)').matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-active', en.isIntersecting); });
    }, { rootMargin: '-40% 0px -40% 0px' });
    $$('.project').forEach(function (p) { io.observe(p); });
  }

  /* ---------- go ---------- */
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn('[HSCA]', e); } }
  safe(renderProjects);
  safe(renderConcepts);
  safe(renderJournal);
  safe(initMenu);
  safe(initTitleBlock);
  safe(initTheme);
  safe(initContact);
  safe(initActiveCards);
  document.dispatchEvent(new CustomEvent('hsca:rendered'));
})();
