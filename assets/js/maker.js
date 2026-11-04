(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* smooth scrolling: the same Lenis setup as the other pages */
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
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) { return; }
      var t = $(id);
      if (!t) { return; }
      e.preventDefault();
      scrollToY(t.getBoundingClientRect().top + window.scrollY - 80);
    });
  });

  /* menu */
  var nav = $("#nav"), mb = $("#menuBtn");
  mb.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    mb.setAttribute("aria-expanded", o ? "true" : "false");
    document.body.style.overflow = o ? "hidden" : "";
    if (lenis) { if (o) { lenis.stop(); } else { lenis.start(); } }
  });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; if (lenis) { lenis.start(); } }); });
  window.addEventListener("scroll", function () { nav.classList.toggle("show-cta", window.scrollY > 200); }, { passive: true });

  /* reveal on scroll (content is visible without JS) */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    rv.forEach(function (n) { io.observe(n); });
    setTimeout(function () { rv.forEach(function (n) { n.classList.add("in"); }); }, 5000);
  } else { rv.forEach(function (n) { n.classList.add("in"); }); }

  /* the logo tile tilts toward the pointer (mouse and pen only) */
  var av = $(".mk-avatar"), tile = $(".mk-tile");
  if (av && tile && !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    av.addEventListener("pointermove", function (e) {
      var r = av.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tile.style.setProperty("--ry", (x * 16).toFixed(2) + "deg");
      tile.style.setProperty("--rx", (-y * 16).toFixed(2) + "deg");
    });
    av.addEventListener("pointerleave", function () { tile.style.setProperty("--rx", "0deg"); tile.style.setProperty("--ry", "0deg"); });
  }
})();

