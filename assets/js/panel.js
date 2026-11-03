/* Interactive Ru Motion panel mock-up (labels taken from the real plugin). */
(function () {
  var ICONS = {
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    animate: '<path d="M7 4l13 8-13 8z"/>',
    text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
    transitions: '<path d="M4 8h13M13 4l4 4-4 4M20 16H7M11 12l-4 4 4 4"/>',
    build: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
    camera: '<rect x="3" y="6" width="14" height="12" rx="3"/><path d="M17 10l4-2v8l-4-2"/>',
    flow: '<path d="M3 20C9 20 8 4 21 4"/>'
  };
  var FLOW = [["linear",0,0,1,1],["easeIn",.42,0,1,1],["easeOut",0,0,.58,1],["ease",.25,.1,.25,1],["sineIn",.12,0,.39,0],["sineOut",.61,1,.88,1],["sine",.37,0,.63,1],["quadIn",.11,0,.5,0],["quadOut",.5,1,.89,1],["quad",.45,0,.55,1],["cubicIn",.32,0,.67,0],["cubicOut",.33,1,.68,1],["cubic",.66,0,.34,1],["quartIn",.5,0,.75,0],["quartOut",.25,1,.5,1],["quart",.76,0,.24,1],["quintIn",.64,0,.78,0],["quintOut",.22,1,.36,1],["quint",.83,0,.17,1],["expoIn",.7,0,.84,0],["expoOut",.16,1,.3,1],["expo",.87,0,.13,1],["circIn",.55,0,1,.45],["circOut",0,.55,.45,1],["circ",.85,0,.15,1],["backIn",.36,0,.66,-.56],["backOut",.34,1.56,.64,1],["back",.68,-.6,.32,1.6]];
  var TABS = [
    { id: "layers", label: "Layers", card: { title: "Layer operations", desc: "Everyday layer chores in one click.", btns: ["Pre-comp", "Unwrap Comp", "Smart Duplicate", "Smart Null", "Adjustment Layer", "Solid Layer", "Follow Path"] } },
    { id: "animate", label: "Animate", chips: [
      ["Quick", "Fast in, out and move presets for the selected layers."],
      ["Move in / out", "Slide layers in or out with expo easing."],
      ["Pop", "Scale a layer in with a soft overshoot."],
      ["Shape morph", "Morph one shape into another."],
      ["UI list stagger", "Bring a list of layers in, one after another."],
      ["Hold push-in", "A slow push-in while the layer holds."]] },
    { id: "text", label: "Text", chips: [
      ["Effects", "Select a text layer and click an effect.", ["Typewriter", "Typewriter Block", "SaaS Text Preset 1", "Letter Blur", "Two-Line Stack", "Word Highlight", "Hero Zoom", "Hero Blur", "Blur Out", "Delete Out", "Bounce Text", "Snap"]],
      ["Text + Icon", "Type a few words, pick an icon slot and build the line."],
      ["Star Swipe", "Wipe one sentence into another with a star."]] },
    { id: "transitions", label: "Cuts", chips: [
      ["Zoom cut", "A fast zoom between two clips."],
      ["Swipe cut", "A swipe between clips, built from linked nulls."],
      ["Shape wipe", "Wipe to the next clip with a shape."]] },
    { id: "build", label: "Build", card: { title: "UI kit and shapes", desc: "Build interface elements in one click.", btns: ["Smart shape", "Pill button", "Frosted glass", "AI glow button", "Liquid-glass button", "Fake cursor", "Avatar bubble", "Audio waveform", "Stock grid wall"] } },
    { id: "camera", label: "Camera", card: { title: "Camera", desc: "Add depth to flat layers.", btns: ["Camera push", "Parallax"] } },
    { id: "flow", label: "Flow", flow: true }
  ];

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[id] + '</svg>'; }
  function curveSvg(c) {
    var y = function (v) { return 34 - v * 34; };
    return '<svg viewBox="-4 -14 108 62" aria-hidden="true"><path d="M0 34 C ' + c[1] * 100 + ' ' + y(c[2]) + ', ' + c[3] * 100 + ' ' + y(c[4]) + ', 100 0"/></svg>';
  }

  function mount(host) {
    var startTab = host.getAttribute("data-tab") || "text";
    var tab = TABS.filter(function (t) { return t.id === startTab; })[0] || TABS[2];
    var chip = 0, flowSel = "expoOut", amt = .5, toastT;

    var pn = el("div", "pn");
    pn.innerHTML = '<div class="pn-hd"><img src="assets/img/logo.svg" alt="" width="26" height="26"><b>Ru Motion</b><span class="pn-about">About</span></div>';
    var body = el("div", "pn-body"), rail = el("div", "pn-rail"), main = el("div", "pn-main"), toast = el("div", "pn-toast");
    rail.setAttribute("role", "tablist"); rail.setAttribute("aria-label", "Panel groups");
    toast.setAttribute("role", "status");
    body.appendChild(rail); body.appendChild(main); pn.appendChild(body); pn.appendChild(toast); host.appendChild(pn);

    function say(msg) {
      toast.textContent = msg; toast.classList.add("on"); clearTimeout(toastT);
      toastT = setTimeout(function () { toast.classList.remove("on"); }, 1400);
    }
    function btn(label, cls, onclick) {
      var b = el("button", "pb" + (cls ? " " + cls : ""), label); b.type = "button";
      b.addEventListener("click", function () {
        b.classList.add("flash"); setTimeout(function () { b.classList.remove("flash"); }, 260);
        say("Applied: " + (onclick || label)); 
      });
      return b;
    }
    function card(title, desc) { var c = el("div", "pn-card"); c.appendChild(el("h4", "", title)); c.appendChild(el("p", "", desc)); return c; }

    function renderRail() {
      rail.innerHTML = "";
      TABS.forEach(function (t) {
        var b = el("button", "pn-tab", icon(t.id) + "<span>" + t.label + "</span>");
        b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", t === tab ? "true" : "false");
        b.addEventListener("click", function () { tab = t; chip = 0; render(); });
        rail.appendChild(b);
      });
    }
    function renderFlow(c) {
      var cd = card("Easing curves", "Pick a curve. It is applied as real temporal ease to the selected keys.");
      var grid = el("div", "pn-ease");
      FLOW.forEach(function (f) {
        var t = el("button", "tile", curveSvg(f) + "<div>" + f[0] + "</div>"); t.type = "button";
        t.setAttribute("aria-pressed", f[0] === flowSel ? "true" : "false");
        t.addEventListener("click", function () {
          flowSel = f[0]; [].forEach.call(grid.children, function (x) { x.setAttribute("aria-pressed", "false"); });
          t.setAttribute("aria-pressed", "true");
        });
        grid.appendChild(t);
      });
      cd.appendChild(grid);
      var sl = el("div", "slider"); sl.setAttribute("role", "slider"); sl.tabIndex = 0;
      sl.setAttribute("aria-label", "Bounce amount"); sl.setAttribute("aria-valuemin", "0"); sl.setAttribute("aria-valuemax", "100");
      var th = el("div", "th"); sl.appendChild(th);
      var val = el("div", "slider-v");
      function set(p) { amt = Math.max(0, Math.min(1, p)); th.style.left = amt * 100 + "%"; val.textContent = "Bounce amount " + Math.round(amt * 100) + "%"; sl.setAttribute("aria-valuenow", Math.round(amt * 100)); }
      function ev(e) { var r = sl.getBoundingClientRect(); set((e.clientX - r.left) / r.width); }
      sl.addEventListener("pointermove", ev); sl.addEventListener("pointerdown", ev);
      sl.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") set(amt + .05); if (e.key === "ArrowLeft") set(amt - .05); });
      set(amt);
      cd.appendChild(sl); cd.appendChild(val);
      var ap = btn("Apply curve", "main", "easing curve"); ap.style.marginTop = "12px"; cd.appendChild(ap);
      c.appendChild(cd);
    }
    function render() {
      renderRail(); main.innerHTML = "";
      if (tab.chips) {
        var chips = el("div", "pn-chips"); chips.setAttribute("role", "tablist");
        tab.chips.forEach(function (ch, i) {
          var b = el("button", "chip", ch[0]); b.type = "button"; b.setAttribute("role", "tab");
          b.setAttribute("aria-selected", i === chip ? "true" : "false");
          b.addEventListener("click", function () { chip = i; render(); });
          chips.appendChild(b);
        });
        main.appendChild(chips);
        var ch = tab.chips[chip], cd = card(ch[0], ch[1]);
        if (ch[2]) { var g = el("div", "pn-grid"); ch[2].forEach(function (n) { g.appendChild(btn(n)); }); cd.appendChild(g); }
        else cd.appendChild(btn("Apply", "main", ch[0]));
        main.appendChild(cd);
      } else if (tab.flow) { renderFlow(main); }
      else {
        var c = card(tab.card.title, tab.card.desc), g2 = el("div", "pn-grid");
        tab.card.btns.forEach(function (n) { g2.appendChild(btn(n)); });
        c.appendChild(g2); main.appendChild(c);
      }
    }
    render();
  }
  document.addEventListener("DOMContentLoaded", function () {
    [].forEach.call(document.querySelectorAll("[data-panel]"), mount);
  });
})();
