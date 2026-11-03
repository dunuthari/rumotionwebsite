(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var nav = $("#nav"), reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* smooth scrolling: eased, cancellable, works with the pinned section (CSS smooth is the no-JS fallback) */
  var anim = null;
  function stopScroll() { if (anim) { cancelAnimationFrame(anim); anim = null; } }
  ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) { window.addEventListener(ev, stopScroll, { passive: true }); });
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function scrollToY(y, done) {
    stopScroll();
    var from = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    y = Math.max(0, Math.min(max, y));
    var dist = y - from;
    if (reduce || Math.abs(dist) < 2) { window.scrollTo(0, y); if (done) done(); return; }
    var dur = Math.min(1200, Math.max(550, Math.abs(dist) * .55)), t0 = null;
    function step(now) {
      if (t0 === null) t0 = now;
      var k = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, from + dist * ease(k));
      if (k < 1) anim = requestAnimationFrame(step); else { anim = null; if (done) done(); }
    }
    anim = requestAnimationFrame(step);
  }
  window.RuScroll = scrollToY;

  /* smooth wheel scrolling (momentum): desktop mouse and trackpad only, native scroll stays for touch and reduced motion */
  (function () {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    var target = window.scrollY, cur = window.scrollY, running = false, last = 0, EASE = 0.11;
    function maxY() { return document.documentElement.scrollHeight - window.innerHeight; }
    function clamp(v) { return Math.max(0, Math.min(maxY(), v)); }
    function frame(now) {
      var dt = Math.min(64, now - last || 16.7); last = now;
      var k = 1 - Math.pow(1 - EASE, dt / 16.67);
      cur += (target - cur) * k;
      if (Math.abs(target - cur) < 0.4) { cur = target; running = false; }
      window.scrollTo(0, cur);
      if (running) requestAnimationFrame(frame);
    }
    function innerCanScroll(el, dy) {
      while (el && el !== document.body) {
        var cs = getComputedStyle(el);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) {
          if (dy < 0 && el.scrollTop > 0) return true;
          if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
        }
        el = el.parentElement;
      }
      return false;
    }
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (document.body.style.overflow === "hidden") return;
      var dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (innerCanScroll(e.target, dy)) return;
      e.preventDefault();
      if (anim) { stopScroll(); target = cur = window.scrollY; }
      else if (!running) { target = cur = window.scrollY; }
      target = clamp(target + dy);
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    }, { passive: false });
    /* keep in sync when the page moves by other means: keyboard, scrollbar drag, anchors, touch */
    window.addEventListener("scroll", function () { if (!running) { target = cur = window.scrollY; } }, { passive: true });
    window.addEventListener("keydown", function () { running = false; }, { passive: true });
    window.addEventListener("mousedown", function () { running = false; target = cur = window.scrollY; }, { passive: true });
  })();
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = $(id);
      if (!target) return;
      e.preventDefault();
      scrollToY(id === "#top" ? 0 : target.getBoundingClientRect().top + window.scrollY, function () {
        if (history.replaceState) history.replaceState(null, "", id);
      });
    });
  });

  /* nav: tone follows the section under it, CTA appears after the hero buttons scroll away */
  var secs = $$("[data-nav]"), heroCtas = $("#heroCtas"), links = $$("#navLinks a");
  function navState() {
    var y = (nav.offsetHeight || 64) / 2, tone = "dark", i, r;
    for (i = 0; i < secs.length; i++) { r = secs[i].getBoundingClientRect(); if (r.top <= y && r.bottom > y) { tone = secs[i].getAttribute("data-nav"); break; } }
    nav.setAttribute("data-tone", tone);
    var cur = null;
    for (i = 0; i < secs.length; i++) { r = secs[i].getBoundingClientRect(); if (r.top <= y && r.bottom > y) { cur = secs[i].getAttribute("data-link"); break; } }
    links.forEach(function (l) { if (cur && l.getAttribute("href") === "#" + cur) { l.setAttribute("aria-current", "true"); } else { l.removeAttribute("aria-current"); } });
    nav.classList.toggle("solid", window.scrollY > 24);
    var show = heroCtas ? heroCtas.getBoundingClientRect().bottom < 0 : true;
    nav.classList.toggle("show-cta", show);
  }
  window.addEventListener("scroll", navState, { passive: true }); window.addEventListener("resize", navState); navState();

  var mb = $("#menuBtn");
  mb.addEventListener("click", function () {
    var o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o ? "true" : "false");
    document.body.style.overflow = o ? "hidden" : "";
  });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }); });

  /* reveal on scroll (content is visible without JS) */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    rv.forEach(function (n) { io.observe(n); });
    setTimeout(function () { rv.forEach(function (n) { n.classList.add("in"); }); }, 6000);
  } else { rv.forEach(function (n) { n.classList.add("in"); }); }

  /* pinned features */
  var feat = $("#features"), steps = $$(".step", feat), prog = $("#featProg"), mq = window.matchMedia("(min-width: 900px)"), cur = -1;
  steps.forEach(function (s, i) {
    var b = document.createElement("button"); b.type = "button"; b.textContent = s.getAttribute("data-label"); b.setAttribute("role", "tab");
    b.addEventListener("click", function () {
      var top = feat.getBoundingClientRect().top + window.scrollY, room = feat.offsetHeight - window.innerHeight;
      scrollToY(top + room * ((i + .5) / steps.length));
    });
    prog.appendChild(b);
  });
  function setStep(i) {
    if (i === cur) return; cur = i;
    steps.forEach(function (s, k) { s.classList.toggle("active", k === i); });
    $$("button", prog).forEach(function (b, k) { b.setAttribute("aria-current", k === i ? "true" : "false"); b.setAttribute("aria-selected", k === i ? "true" : "false"); });
  }
  function featScroll() {
    if (!mq.matches) { steps.forEach(function (s) { s.classList.remove("active"); }); cur = -1; return; }
    var r = feat.getBoundingClientRect(), room = r.height - window.innerHeight;
    var p = room > 0 ? Math.max(0, Math.min(.999, -r.top / room)) : 0;
    setStep(Math.floor(p * steps.length));
  }
  window.addEventListener("scroll", featScroll, { passive: true }); window.addEventListener("resize", featScroll); mq.addEventListener && mq.addEventListener("change", featScroll); featScroll();

  /* timeline: drag keyframes */
  var rows = $("#tlRows"), play = $("#tlPlay"), label = $("#tlTime");
  var kfs = [[0, .06], [0, .34], [1, .22], [1, .30]], nodes = [], lines = [];
  function build() {
    $$(".tl-row", rows).forEach(function (row, ri) {
      var pair = kfs.filter(function (k) { return k[0] === ri; }), line = document.createElement("div"); line.className = "kf-line"; row.appendChild(line);
      lines[ri] = { el: line, keys: [] };
      pair.forEach(function (k, ki) {
        var d = document.createElement("div"); d.className = "kf"; d.tabIndex = 0; d.setAttribute("role", "slider");
        d.setAttribute("aria-label", "Keyframe " + (ki + 1) + " of " + (ri ? "Pop" : "Typewriter")); d.setAttribute("aria-valuemin", "0"); d.setAttribute("aria-valuemax", "100");
        row.appendChild(d); lines[ri].keys.push({ node: d, k: k });
        function move(x) { var r = row.getBoundingClientRect(), p = Math.max(.02, Math.min(.98, (x - r.left) / r.width)); k[1] = p; upd(); }
        d.addEventListener("pointerdown", function (e) { d.setPointerCapture(e.pointerId); move(e.clientX); d.onpointermove = function (ev) { move(ev.clientX); }; });
        d.addEventListener("pointerup", function () { d.onpointermove = null; });
        d.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { k[1] = Math.min(.98, k[1] + .02); upd(); } if (e.key === "ArrowLeft") { k[1] = Math.max(.02, k[1] - .02); upd(); } });
      });
    });
    upd();
  }
  function upd() {
    lines.forEach(function (L, ri) {
      var a = L.keys[0].k[1], b = L.keys[1].k[1], lo = Math.min(a, b), hi = Math.max(a, b);
      L.keys.forEach(function (o) { o.node.style.left = o.k[1] * 100 + "%"; o.node.setAttribute("aria-valuenow", Math.round(o.k[1] * 100)); });
      L.el.style.left = lo * 100 + "%"; L.el.style.width = (hi - lo) * 100 + "%";
      if (ri === 0) label.textContent = "Typed: " + (lo * 10).toFixed(1) + " s to " + (hi * 10).toFixed(1) + " s, speed " + (hi - lo > .01 ? (1 / ((hi - lo) * 10)).toFixed(2) : "max") + "x";
    });
  }
  if (rows) {
    build();
    var t0 = performance.now(), padL = 0;
    (function loop(t) { if (!reduce) { var p = ((t - t0) / 6000) % 1; play.style.left = (p * 100) + "%"; } requestAnimationFrame(loop); })(t0);
    if (reduce) play.style.left = "40%";
  }
})();
