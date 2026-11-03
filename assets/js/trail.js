/* Hero cursor trail: small effect cards appear under the pointer as it moves, sharpen, hold, then blur away. */
(function () {
  var hero = document.getElementById("top");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (!hero.animate) return;

  var layer = document.createElement("div");
  layer.className = "trail";
  layer.setAttribute("aria-hidden", "true");
  hero.appendChild(layer);

  var curve = function (d, c) { return '<svg viewBox="0 0 60 60" fill="none"><path d="M8 52H52M8 8H52" stroke="' + c + '" stroke-opacity=".18"/><path d="' + d + '" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round"/><circle cx="52" cy="8" r="3.6" fill="' + c + '"/></svg>'; };
  var R = document.querySelector(".brand img");
  var logoSrc = R ? R.getAttribute("src") : "";

  /* each card: [background, ink color, inner html] */
  var CARDS = [
    ["#DCFA37", "#101010", logoSrc ? '<img src="' + logoSrc + '" alt="" style="width:62%;border-radius:31%">' : '<b class="tl-big">R</b>'],
    ["#2B2D31", "#DCFA37", curve("M8 52C20 52 24 8 52 8", "#DCFA37") + '<i class="tl-lab">expoOut</i>'],
    ["#FAFAFA", "#101010", '<b class="tl-type">Type<span class="tl-caret"></span></b><i class="tl-lab">Typewriter</i>'],
    ["#1C1D20", "#DCFA37", '<div class="tl-kf"><u></u><s></s><u></u></div><i class="tl-lab">2 keyframes</i>'],
    ["#8A7DFF", "#101010", '<div class="tl-pop"></div><i class="tl-lab">Pop</i>'],
    ["#DCFA37", "#101010", '<div class="tl-swipe"><s></s><u></u></div><i class="tl-lab">Swipe cut</i>'],
    ["#101010", "#F1F2F4", '<b class="tl-aa">Aa</b><i class="tl-lab">Hero Zoom</i>'],
    ["#2B2D31", "#DCFA37", curve("M8 52C16 52 22 -6 36 8C44 16 48 8 52 8", "#DCFA37") + '<i class="tl-lab">backOut</i>'],
    ["#FAFAFA", "#101010", '<div class="tl-wave"><s></s><s></s><s></s><s></s><s></s><s></s><s></s></div><i class="tl-lab">Waveform</i>'],
    ["#DCFA37", "#101010", '<span class="tl-pill">Get started</span><i class="tl-lab">Pill button</i>'],
    ["#1C1D20", "#F1F2F4", '<b class="tl-blur">Blur</b><i class="tl-lab">Blur Out</i>'],
    ["#8A7DFF", "#101010", '<svg viewBox="0 0 60 60"><path d="M30 6l5 19 19 5-19 5-5 19-5-19-19-5 19-5z" fill="#101010"/></svg><i class="tl-lab">Star Swipe</i>']
  ];

  var idx = 0, z = 1, lastX = null, lastY = null, STEP = 84, live = [];

  function spawn(x, y) {
    var c = CARDS[idx++ % CARDS.length], el = document.createElement("div");
    el.className = "trail-card";
    el.style.background = c[0]; el.style.color = c[1]; el.style.zIndex = String(z++);
    el.style.left = x + "px"; el.style.top = y + "px";
    el.innerHTML = c[2];
    layer.appendChild(el);
    live.push(el);
    if (live.length > 16) { var old = live.shift(); if (old.parentNode) old.parentNode.removeChild(old); }
    var rot = (Math.random() * 12 - 6).toFixed(1), tf = function (s) { return "translate(-50%,-50%) rotate(" + rot + "deg) scale(" + s + ")"; };
    var a = el.animate([
      { opacity: 0, filter: "blur(14px)", transform: tf(0.7), offset: 0 },
      { opacity: 1, filter: "blur(0px)", transform: tf(1), offset: 0.2 },
      { opacity: 1, filter: "blur(0px)", transform: tf(1), offset: 0.68 },
      { opacity: 0, filter: "blur(14px)", transform: tf(0.9), offset: 1 }
    ], { duration: 1500, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" });
    a.onfinish = function () {
      var i = live.indexOf(el); if (i > -1) live.splice(i, 1);
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }

  hero.addEventListener("pointermove", function (e) {
    if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (lastX === null) { lastX = x; lastY = y; return; }
    var dx = x - lastX, dy = y - lastY;
    if (dx * dx + dy * dy >= STEP * STEP) { lastX = x; lastY = y; spawn(x, y); }
  });
  hero.addEventListener("pointerleave", function () { lastX = lastY = null; });
})();
