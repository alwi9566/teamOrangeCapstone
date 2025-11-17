(function () {
  // If already present → remove (toggle behavior)
  const existing = document.getElementById("raven-panel");
  if (existing) {
    existing.remove();
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("panel.html");
  iframe.id = "raven-panel";

  document.body.appendChild(iframe);
})();
