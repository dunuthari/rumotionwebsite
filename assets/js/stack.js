/* Stacking feature cards: scale and dim the cards under the one that is arriving, tilt the demo toward the pointer,
   and let the pills change the demo's caption on hover. */
(function () {
  var wrap = document.getElementById("stack");
  if (!wrap) return;
  var cards = [].slice.call(wrap.querySelectorAll(".scard"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SHRINK = 0.045, DIM = 0.16, queued = false;

  function topOf(c) { return parseFloat(getComputedStyle(c).top) || 0; }

  function update() {
    queued = false;
    if (reduce) return;
    var prog = cards.map(function (c) {
      var r = c.getBoundingClientRect(), h = c.offsetHeight || 1;
      return Math.max(0, Math.min(1, 1 - (r.top - topOf(c)) / (h * 0.85)));
    });
    cards.forEach(function (c, i) {
      var sum = 0, j;
      for (j = i + 1; j < cards.length; j++) { sum += prog[j]; }
      c.style.setProperty("--s", (1 - SHRINK * sum).toFixed(4));
      c.style.setProperty("--d", Math.min(0.6, DIM * sum).toFixed(3));
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();

  /* the demo tilts toward the pointer (mouse and pen only) */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    cards.forEach(function (c) {
      var vis = c.querySelector(".vis");
      if (!vis) return;
      vis.addEventListener("pointermove", function (e) {
        var r = vis.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        vis.style.setProperty("--ry", (x * 9).toFixed(2) + "deg");
        vis.style.setProperty("--rx", (-y * 9).toFixed(2) + "deg");
      });
      vis.addEventListener("pointerleave", function () { vis.style.setProperty("--rx", "0deg"); vis.style.setProperty("--ry", "0deg"); });
    });
  }

  /* hovering or focusing a pill names it in the demo's caption */
  cards.forEach(function (c) {
    var cap = c.querySelector(".vis .cap"), base = cap ? cap.textContent : "";
    [].forEach.call(c.querySelectorAll(".step-copy li"), function (li) {
      li.tabIndex = 0;
      function on() { li.classList.add("on"); if (cap) { cap.textContent = li.textContent.toUpperCase(); cap.classList.add("hot"); } }
      function off() { li.classList.remove("on"); if (cap) { cap.textContent = base; cap.classList.remove("hot"); } }
      li.addEventListener("pointerenter", on); li.addEventListener("pointerleave", off);
      li.addEventListener("focus", on); li.addEventListener("blur", off);
    });
  });

  /* clicking a pill replays that card's demo, so the card feels like a live control (keyboard: Enter or Space) */
  cards.forEach(function (c) {
    var vis = c.querySelector(".vis");
    [].forEach.call(c.querySelectorAll(".step-copy li"), function (li) {
      li.setAttribute("role", "button");
      function replay() {
        if (!vis || reduce || !vis.getAnimations) return;
        vis.getAnimations({ subtree: true }).forEach(function (a) { try { a.cancel(); a.play(); } catch (err) {} });
        li.classList.add("hit"); setTimeout(function () { li.classList.remove("hit"); }, 260);
      }
      li.addEventListener("click", replay);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); replay(); } });
    });
  });
})();
