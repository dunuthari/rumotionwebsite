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

  /* the plugin's eight main tabs, drawn as lime line icons (24x24 grid) */
  var S = 'viewBox="0 0 24 24" fill="none" stroke="#DCFA37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  var TABS = [
    ["Layers", '<svg ' + S + '><rect x="3.5" y="3.5" width="11" height="11" rx="3"/><rect x="9.5" y="9.5" width="11" height="11" rx="3"/></svg>'],
    ["Animate", '<svg ' + S + '><path d="M7 4.5l12 7.5-12 7.5z"/></svg>'],
    ["Text", '<svg ' + S + '><path d="M5 6.5V4.5h14v2M12 4.5v15M9 19.5h6"/></svg>'],
    ["Transitions", '<svg ' + S + '><path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/></svg>'],
    ["Build", '<svg ' + S + '><circle cx="8.5" cy="8.5" r="4.5"/><rect x="11" y="11" width="9.5" height="9.5" rx="2.5"/></svg>'],
    ["Camera", '<svg ' + S + '><rect x="3" y="6.5" width="13" height="11" rx="3"/><path d="M16 10.5l5-2.5v8l-5-2.5"/></svg>'],
    ["Flow", '<svg ' + S + '><path d="M3 20C10 20 8 4 21 4"/></svg>'],
    ["Style", '<svg ' + S + '><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".9" fill="#DCFA37"/><circle cx="15" cy="10" r=".9" fill="#DCFA37"/><circle cx="12" cy="15" r=".9" fill="#DCFA37"/></svg>']
  ];
  var CARDS = TABS.map(function (t) { return ["#1C1D20", "#F1F2F4", t[1] + '<i class="tl-lab">' + t[0] + '</i>']; });

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
