(function () {
  var KEY = "pb_investor_access";
  var TTL_MS = 7 * 24 * 60 * 60 * 1000;

  function grantAccess() {
    try {
      sessionStorage.setItem(KEY, String(Date.now()));
    } catch (e) {}
  }

  function hasAccess() {
    try {
      var ts = sessionStorage.getItem(KEY);
      if (!ts) return false;
      return Date.now() - parseInt(ts, 10) < TTL_MS;
    } catch (e) {
      return false;
    }
  }

  window.pbInvestorGate = { grantAccess: grantAccess, hasAccess: hasAccess };

  if (document.body.classList.contains("deck-body") && !hasAccess()) {
    window.location.replace("/investors.html?access=required");
  }
})();
