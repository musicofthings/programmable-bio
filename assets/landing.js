(function () {
  var button = document.querySelector("[data-copy-code]");
  if (!button) return;

  button.addEventListener("click", function () {
    var code = document.querySelector(".code-window pre code");
    if (!code || !navigator.clipboard) return;
    navigator.clipboard.writeText(code.innerText).then(function () {
      button.textContent = "Copied";
      window.setTimeout(function () {
        button.textContent = "Copy";
      }, 1600);
    });
  });
})();
