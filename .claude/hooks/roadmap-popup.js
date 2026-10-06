/*
 * Hook: IT Project Roadmap reminder popup.
 * Shows a popup 10 seconds after the page loads, announcing the IT Project
 * Roadmap session next Monday at 2:00 PM in the Town Hall Meeting Room.
 * "Next Monday" is computed from today's date, so it never goes stale.
 * Vanilla JS, no persistence: it shows once per page load (refresh = again).
 */
(function () {
  "use strict";

  var DELAY_MS = 10000;
  var TITLE = "IT Project Roadmap";
  var TIME = "2:00 PM";
  var ROOM = "Town Hall Meeting Room";

  function nextMonday(from) {
    var d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    var add = (8 - d.getDay()) % 7 || 7; // Mon=1; if today is Monday, use +7
    d.setDate(d.getDate() + add);
    return d;
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".rm-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;" +
      "justify-content:center;padding:16px;background:rgba(11,42,91,.45)}" +
      ".rm-dialog{width:100%;max-width:420px;background:var(--surface,#fff);color:var(--ink,#14202f);" +
      "border-radius:var(--radius,8px);box-shadow:0 8px 32px rgba(11,42,91,.35);" +
      "border-top:6px solid var(--blue-600,#1f5fbf);padding:20px 22px;" +
      "font-family:var(--font,system-ui,sans-serif)}" +
      ".rm-dialog h2{margin:0 0 4px;font-size:1.2rem}" +
      ".rm-sub{margin:0 0 14px;color:var(--ink-soft,#4a5a6e);font-size:.9rem}" +
      ".rm-list{margin:0 0 18px;padding:0;list-style:none;display:grid;gap:8px}" +
      ".rm-list li{display:flex;gap:10px;align-items:baseline}" +
      ".rm-list b{min-width:3.6rem;color:var(--ink-soft,#4a5a6e);font-weight:600;font-size:.85rem}" +
      ".rm-close{float:right;border:0;border-radius:6px;padding:8px 18px;cursor:pointer;" +
      "background:var(--blue-600,#1f5fbf);color:#fff;font:inherit;font-weight:600}" +
      ".rm-close:focus-visible{outline:3px solid var(--blue-300,#9dbfe8);outline-offset:2px}";
    document.head.appendChild(style);
  }

  function showPopup() {
    if (document.getElementById("rm-overlay")) return;
    var when = nextMonday(new Date()).toLocaleDateString(undefined, {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    var previousFocus = document.activeElement;

    injectStyles();
    var overlay = document.createElement("div");
    overlay.className = "rm-overlay";
    overlay.id = "rm-overlay";
    overlay.innerHTML =
      '<div class="rm-dialog" role="dialog" aria-modal="true" aria-labelledby="rm-title">' +
      '<h2 id="rm-title">📅 ' + TITLE + '</h2>' +
      '<p class="rm-sub">Reminder: you are invited to the upcoming session.</p>' +
      '<ul class="rm-list">' +
      "<li><b>Date</b><span>" + when + "</span></li>" +
      "<li><b>Time</b><span>" + TIME + "</span></li>" +
      "<li><b>Where</b><span>" + ROOM + "</span></li>" +
      "</ul>" +
      '<button type="button" class="rm-close">Got it</button>' +
      "</div>";

    function close() {
      document.removeEventListener("keydown", onKey);
      overlay.remove();
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    var btn = overlay.querySelector(".rm-close");
    btn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(overlay);
    btn.focus();
  }

  setTimeout(showPopup, DELAY_MS);
})();
