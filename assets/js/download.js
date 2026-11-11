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

  /* nav: tone follows the section under it; menu on phones */
  var nav = $("#nav"), mb = $("#menuBtn"), secs = $$("[data-nav]");
  function navState() {
    var y = (nav.offsetHeight || 64) / 2, tone = "dark", i, r;
    for (i = 0; i < secs.length; i++) { r = secs[i].getBoundingClientRect(); if (r.top <= y && r.bottom > y) { tone = secs[i].getAttribute("data-nav"); break; } }
    nav.setAttribute("data-tone", tone);
    nav.classList.toggle("solid", window.scrollY > 24);
  }
  window.addEventListener("scroll", navState, { passive: true }); window.addEventListener("resize", navState); navState();
  mb.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    mb.setAttribute("aria-expanded", o ? "true" : "false");
    document.body.style.overflow = o ? "hidden" : "";
    if (lenis) { if (o) { lenis.stop(); } else { lenis.start(); } }
  });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; if (lenis) { lenis.start(); } }); });

  /* reveal on scroll (content is visible without JS) */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    rv.forEach(function (n) { io.observe(n); });
    setTimeout(function () { rv.forEach(function (n) { n.classList.add("in"); }); }, 5000);
  } else { rv.forEach(function (n) { n.classList.add("in"); }); }

  /* mark the visitor's own system (the one download works for both) */
  var ua = (navigator.userAgent || "") + " " + (navigator.platform || ""), os = /Win/i.test(ua) ? "windows" : (/Mac/i.test(ua) && !/iPhone|iPad/i.test(ua)) ? "mac" : "";
  if (os) {
    var card = $('.dl-card[data-os="' + os + '"]');
    if (card) {
      card.classList.add("is-you");
      var tag = $(".dl-you", card); if (tag) { tag.hidden = false; }
    }
    var label = $("#dlOs"); if (label) { label.textContent = "/ DETECTED: " + (os === "windows" ? "WINDOWS" : "MAC"); }
  }

  /* copy the checksum */
  var cb = $("#copyHash"), hash = $("#dlHash");
  if (cb && hash) {
    cb.addEventListener("click", function () {
      var text = hash.textContent.trim(), done = function () { cb.textContent = "Copied"; setTimeout(function () { cb.textContent = "Copy"; }, 1400); };
      function fallback() {
        try { var r = document.createRange(); r.selectNodeContents(hash); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
      }
      try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
    });
  }
})();
