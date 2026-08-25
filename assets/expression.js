(function () {
  "use strict";

  var pricing = document.querySelector("[data-usd-inr-rate]");
  if (!pricing) return;

  var tiers = [
    { max: 47, price: 89, name: "T1" },
    { max: 90, price: 79, name: "T2" },
    { max: 188, price: 69, name: "T3" },
    { max: 400, price: 59, name: "T4" },
    { max: 768, price: 49, name: "T5" }
  ];
  var exchangeRate = Number(pricing.getAttribute("data-usd-inr-rate")) || 95.77;
  var countInput = document.getElementById("protein-count");
  var slider = document.getElementById("protein-slider");
  var currency = "USD";
  var replicates = 2;

  function clamp(value) {
    return Math.min(768, Math.max(20, Math.round(Number(value) || 20)));
  }

  function tierFor(count) {
    return tiers.find(function (tier) { return count <= tier.max; }) || tiers[tiers.length - 1];
  }

  function sliderFromCount(count) {
    var progress = (Math.log(count) - Math.log(20)) / (Math.log(768) - Math.log(20));
    return Math.round(progress * 1000);
  }

  function countFromSlider(value) {
    var progress = Number(value) / 1000;
    return clamp(Math.exp(Math.log(20) + progress * (Math.log(768) - Math.log(20))));
  }

  function money(usd, compact) {
    if (currency === "INR") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
        notation: compact ? "compact" : "standard"
      }).format(Math.round(usd * exchangeRate));
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: compact ? "compact" : "standard"
    }).format(Math.round(usd));
  }

  function render() {
    var count = clamp(countInput.value);
    var tier = tierFor(count);
    var base = count * tier.price;
    var replicateCost = Math.max(0, replicates - 2) * 9 * count;
    var subtotal = base + replicateCost;
    var total = subtotal;
    var perProtein = Math.round(total / count);

    countInput.value = String(count);
    slider.value = String(sliderFromCount(count));
    document.getElementById("tier-name").textContent = tier.name;
    document.getElementById("unit-price").textContent = money(tier.price);
    document.getElementById("estimate-formula").textContent = count + " proteins × " + money(tier.price) + " (" + tier.name + ")";
    document.getElementById("base-total").textContent = money(base);
    document.getElementById("grand-total").textContent = money(total);
    document.getElementById("per-protein").textContent = money(perProtein) + " / protein";

    var replicateRow = document.getElementById("replicate-cost-row");
    replicateRow.hidden = replicateCost === 0;
    document.getElementById("replicate-cost").textContent = money(replicateCost);
    document.getElementById("replicate-note").textContent = replicates === 2
      ? "Duplicate included in price."
      : "+" + money(9) + " / protein for each extra replicate.";

    document.getElementById("currency-note").textContent = currency === "INR"
      ? "Indicative INR planning conversion at ₹" + exchangeRate.toFixed(2) + " per USD on 25 August 2026. Final conversion, GST, duties, and shipping are quoted separately."
      : "Indicative USD planning estimate. Final scope, taxes, duties, and shipping are quoted separately.";

    var params = new URLSearchParams({
      service: "Protein Expression",
      proteins: String(count),
      replicates: String(replicates)
    });
    document.getElementById("estimate-cta").href = "/express-interest.html?" + params.toString();
  }

  countInput.addEventListener("input", render);
  countInput.addEventListener("change", render);
  slider.addEventListener("input", function () {
    countInput.value = String(countFromSlider(slider.value));
    render();
  });
  document.querySelectorAll("[data-count]").forEach(function (button) {
    button.addEventListener("click", function () {
      countInput.value = button.getAttribute("data-count");
      render();
    });
  });

  document.querySelectorAll("[data-replicates]").forEach(function (button) {
    button.addEventListener("click", function () {
      replicates = Number(button.getAttribute("data-replicates"));
      document.querySelectorAll("[data-replicates]").forEach(function (option) {
        option.setAttribute("aria-pressed", String(option === button));
      });
      render();
    });
  });

  document.querySelectorAll("[data-currency]").forEach(function (button) {
    button.addEventListener("click", function () {
      currency = button.getAttribute("data-currency");
      document.querySelectorAll("[data-currency]").forEach(function (option) {
        option.setAttribute("aria-pressed", String(option === button));
      });
      render();
    });
  });

  render();
})();
