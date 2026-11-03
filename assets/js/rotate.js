/* Hero text rotator: vanilla port of the "text-rotate" effect (per-character slide, stagger from last,
   "wait" mode, box resizes to the word). The selection outline lives on the parent (.sel) and follows the width. */
(function () {
  var rot = document.getElementById("rot");
  if (!rot) return;
  var words = (rot.getAttribute("data-words") || "").split("|").filter(Boolean);
  var holder = rot.querySelector(".rot-t");
  if (words.length < 2 || !holder || !holder.animate) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var INTERVAL = 2300, STAGGER = 26, OUT_MS = 380, IN_MS = 640;
  var idx = 0, timer = null, busy = false;

  /* keep a screen-reader copy of the original phrase; the animated copy is hidden from assistive tech */
  var sr = document.createElement("span");
  sr.className = "sr"; sr.textContent = words[0];
  rot.parentNode.insertBefore(sr, rot);
  rot.setAttribute("aria-hidden", "true");

  function build(text) {
    var frag = document.createDocumentFragment(), parts = text.split(" "), chars = [];
    parts.forEach(function (w, wi) {
      var ws = document.createElement("span"); ws.className = "rot-w";
      Array.from(w).forEach(function (ch) {
        var c = document.createElement("span"); c.className = "rot-c"; c.textContent = ch;
        ws.appendChild(c); chars.push(c);
      });
      frag.appendChild(ws);
      if (wi < parts.length - 1) { var sp = document.createElement("span"); sp.className = "rot-sp"; sp.innerHTML = "&nbsp;"; frag.appendChild(sp); }
    });
    return { frag: frag, chars: chars };
  }
  function widthOf(text) {
    var m = document.createElement("span");
    m.className = "rot-measure"; m.textContent = text;
    rot.appendChild(m); var w = m.getBoundingClientRect().width; rot.removeChild(m);
    return Math.ceil(w);
  }
  function stagger(chars, i) { return (chars.length - 1 - i) * STAGGER; }   /* staggerFrom: "last" */

  function show(text, animateIn) {
    holder.innerHTML = "";
    var b = build(text); holder.appendChild(b.frag);
    if (!animateIn) return [];
    return b.chars.map(function (c, i) {
      return c.animate([{ transform: "translateY(100%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
        { duration: IN_MS, delay: stagger(b.chars, i), easing: "cubic-bezier(0.34, 1.35, 0.5, 1)", fill: "both" });
    });
  }

  function step() {
    if (busy || document.hidden) return schedule();
    busy = true;
    var next = (idx + 1) % words.length;
    var oldChars = [].slice.call(holder.querySelectorAll(".rot-c"));
    var outs = oldChars.map(function (c, i) {
      return c.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-120%)", opacity: 0 }],
        { duration: OUT_MS, delay: stagger(oldChars, i), easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" });
    });
    var wait = OUT_MS + (oldChars.length ? stagger(oldChars, 0) : 0);
    setTimeout(function () {
      idx = next;
      rot.style.width = widthOf(words[idx]) + "px";      /* outline + box follow the new word */
      show(words[idx], true);
      sr.textContent = words[idx];
      busy = false; schedule();
    }, wait);
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(step, INTERVAL); }

  /* fix the starting width so it can transition, then start */
  function init() {
    rot.style.width = widthOf(words[0]) + "px";
    rot.classList.add("is-live");
    schedule();
  }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(init); } else { init(); }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) schedule(); });
  window.addEventListener("resize", function () { rot.style.width = widthOf(words[idx]) + "px"; });
})();
