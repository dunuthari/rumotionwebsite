(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* smooth scrolling: the same Lenis setup as the landing page */
  var lenis = null;
  if (window.Lenis) {
    try { lenis = new window.Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true, allowNestedScroll: true }); } catch (err) { lenis = null; }
  }
  window.lenis = lenis;
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function scrollToY(y) {
    y = Math.max(0, y);
    if (lenis) { lenis.scrollTo(y, { duration: Math.min(1.3, Math.max(0.6, Math.abs(y - window.scrollY) / 3000)), easing: ease, force: true }); }
    else { window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" }); }
  }

  /* mobile menu */
  var nav = $("#nav"), mb = $("#menuBtn");
  mb.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    mb.setAttribute("aria-expanded", o ? "true" : "false");
    document.body.style.overflow = o ? "hidden" : "";
    if (lenis) { if (o) { lenis.stop(); } else { lenis.start(); } }
  });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; if (lenis) { lenis.start(); } }); });
  window.addEventListener("scroll", function () { nav.classList.toggle("show-cta", window.scrollY > 200); }, { passive: true });

  /* smooth expand and collapse; one answer open at a time */
  var items = $$(".q"), EASE = "cubic-bezier(0.16, 1, 0.3, 1)", DUR = reduce ? 0 : 420;
  function stop(q) { if (q._a) { q._a.cancel(); q._a = null; } if (q._b) { q._b.cancel(); q._b = null; } }
  function openQ(q) {
    if (q.open && !q._closing) { return; }
    stop(q); q._closing = false; q.classList.remove("is-closing");
    var sum = q.querySelector("summary"), body = q.querySelector(".a");
    var from = q.open ? q.offsetHeight : sum.offsetHeight + 2;   /* closed height: summary + borders */
    q.style.overflow = "hidden";
    q.open = true;
    var to = q.scrollHeight + 2;
    q._a = q.animate([{ height: from + "px" }, { height: to + "px" }], { duration: DUR, easing: EASE });
    q._b = body.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], { duration: DUR, easing: EASE });
    q._a.onfinish = function () { q._a = null; q._b = null; q.style.overflow = ""; q.style.height = ""; };
  }
  function closeQ(q) {
    if (!q.open || q._closing) { return; }
    stop(q); q._closing = true; q.classList.add("is-closing");
    var sum = q.querySelector("summary"), body = q.querySelector(".a");
    var from = q.offsetHeight, to = sum.offsetHeight + 2;
    q.style.overflow = "hidden";
    q._a = q.animate([{ height: from + "px" }, { height: to + "px" }], { duration: DUR * .8, easing: EASE });
    q._b = body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: DUR * .5, easing: EASE, fill: "forwards" });
    q._a.onfinish = function () { q._a = null; q._b = null; q._closing = false; q.classList.remove("is-closing"); q.open = false; q.style.overflow = ""; q.style.height = ""; };
  }
  function reveal(q) {   /* after the layout settles, bring the opened question into view if the others closing moved it off-screen */
    setTimeout(function () {
      var r = q.getBoundingClientRect(), top = (nav.offsetHeight || 64) + 16;
      if (r.top < top || r.top > window.innerHeight - 120) { scrollToY(r.top + window.scrollY - top); }
    }, DUR + 40);
  }
  function select(q) {
    items.forEach(function (o) { if (o !== q && o.open) { closeQ(o); } });
    openQ(q);
    reveal(q);
  }
  items.forEach(function (q) {
    $("summary", q).addEventListener("click", function (e) {
      e.preventDefault();
      if (q.open && !q._closing) { closeQ(q); } else { select(q); }
    });
  });

  /* open the question named in the address (#q3), and when its table-of-contents link is used */
  function fromHash() {
    var id = location.hash.replace("#", "");
    var q = id && /^q\d+$/.test(id) ? document.getElementById(id) : null;
    if (q) { select(q); }
  }
  $$(".faq-toc a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var q = document.getElementById(a.getAttribute("href").slice(1));
      if (q) { select(q); if (history.replaceState) { history.replaceState(null, "", "#" + q.id); } }
    });
  });
  window.addEventListener("hashchange", fromHash);
  if (location.hash) { fromHash(); } else if (items[0]) { items[0].open = true; }

  /* other in-page links scroll smoothly too */
  $$('a[href^="#"]').forEach(function (a) {
    if (a.closest(".faq-toc")) { return; }
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) { return; }
      var t = $(id);
      if (!t) { return; }
      e.preventDefault();
      scrollToY(t.getBoundingClientRect().top + window.scrollY - ((nav.offsetHeight || 64) + 16));
    });
  });
})();

