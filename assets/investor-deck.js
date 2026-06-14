(function () {
  var main = document.getElementById("deck-main");
  var slides = main ? main.querySelectorAll(".deck-slide") : [];
  var progress = document.getElementById("deck-progress");
  var prevBtn = document.getElementById("deck-prev");
  var nextBtn = document.getElementById("deck-next");
  var current = 0;

  function updateProgress() {
    if (progress) progress.textContent = (current + 1) + " / " + slides.length;
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    current = index;
    slides[current].scrollIntoView({ behavior: "smooth", block: "start" });
    updateProgress();
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(current - 1);
    }
  });

  if (main && slides.length) {
    main.addEventListener("scroll", function () {
      var mid = main.scrollTop + main.clientHeight / 2;
      for (var i = 0; i < slides.length; i++) {
        var rect = slides[i].getBoundingClientRect();
        var top = rect.top + main.scrollTop - main.getBoundingClientRect().top;
        if (mid >= top && mid < top + slides[i].offsetHeight) {
          current = i;
          break;
        }
      }
      updateProgress();
    });
  }

  updateProgress();
})();
