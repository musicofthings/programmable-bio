(function () {
  var main = document.getElementById("deck-main");
  if (!main) return;

  var slides = Array.prototype.slice.call(main.querySelectorAll(".deck-slide"));
  if (!slides.length) return;

  var progress = document.getElementById("deck-progress");
  var prevBtn = document.getElementById("deck-prev");
  var nextBtn = document.getElementById("deck-next");
  var current = 0;
  var deepest = 0;

  function labelFor(slide) {
    var el = slide.querySelector(".deck-slide-label");
    return el ? el.textContent.trim() : "";
  }

  function updateProgress() {
    if (progress) progress.textContent = current + 1 + " / " + slides.length;
  }

  /* ---- engagement tracking -------------------------------------------- */
  /* Dwell time per slide, flushed once on exit. No cookies, no identifiers
     beyond a per-visit random id, so this stays outside GDPR consent scope. */

  var endpoint = document.body.getAttribute("data-analytics-endpoint") || "";
  var dwell = slides.map(function () { return 0; });
  var enteredAt = Date.now();
  var startedAt = enteredAt;
  var visitId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  var flushed = false;

  function accrue() {
    var now = Date.now();
    dwell[current] += now - enteredAt;
    enteredAt = now;
  }

  function flush() {
    if (flushed) return;
    flushed = true;
    accrue();

    var payload = {
      visitId: visitId,
      deck: window.location.pathname,
      referrer: document.referrer || null,
      totalMs: Date.now() - startedAt,
      deepestSlide: deepest + 1,
      slideCount: slides.length,
      slides: slides.map(function (s, i) {
        return { index: i + 1, label: labelFor(s), ms: dwell[i] };
      }).filter(function (s) { return s.ms > 400; })
    };

    if (!endpoint) {
      if (window.console && console.debug) console.debug("[deck] engagement", payload);
      return;
    }
    try {
      var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
    } catch (e) {}
  }

  /* pagehide is the only exit event Safari reliably fires */
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });

  /* ---- active slide via IntersectionObserver --------------------------- */

  function setCurrent(index) {
    if (index === current) return;
    accrue();
    current = index;
    if (index > deepest) deepest = index;
    updateProgress();
  }

  if ("IntersectionObserver" in window) {
    var ratios = slides.map(function () { return 0; });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          ratios[slides.indexOf(entry.target)] = entry.intersectionRatio;
        });
        var best = 0;
        for (var i = 1; i < ratios.length; i++) {
          if (ratios[i] > ratios[best]) best = i;
        }
        setCurrent(best);
      },
      { root: main, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    slides.forEach(function (s) { io.observe(s); });
  }

  /* ---- navigation ------------------------------------------------------ */

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    setCurrent(index);
    slides[index].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;

    if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(slides.length - 1);
    }
  });

  updateProgress();
})();
