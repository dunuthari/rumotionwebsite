(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var nav = $("#nav"), reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav: tone follows the section under it, CTA appears after the hero buttons scroll away */
  var secs = $$("[data-nav]"), heroCtas = $("#heroCtas");
  function navState() {
    var y = (nav.offsetHeight || 64) / 2, tone = "dark", i, r;
    for (i = 0; i < secs.length; i++) { r = secs[i].getBoundingClientRect(); if (r.top <= y && r.bottom > y) { tone = secs[i].getAttribute("data-nav"); break; } }
    nav.setAttribute("data-tone", tone);
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
      window.scrollTo({ top: top + room * ((i + .5) / steps.length), behavior: reduce ? "auto" : "smooth" });
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
