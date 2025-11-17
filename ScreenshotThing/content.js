// Remove existing panel if it exists (toggle behavior)
const existing = document.getElementById("raven-panel");
if (existing) {
  existing.remove();
  return;
}

// Create container
const panel = document.createElement("iframe");
panel.src = chrome.runtime.getURL("panel.html");
panel.id = "raven-panel";

document.body.appendChild(panel);
