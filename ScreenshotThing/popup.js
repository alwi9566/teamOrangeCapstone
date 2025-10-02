document.getElementById("captureBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "capture" }, (response) => {
    if (response.success) {
      loadScreenshot();
    } else {
      alert("Error: " + response.error);
    }
  });
});

function loadScreenshot() {
  chrome.storage.local.get("screenshot", (data) => {
    if (data.screenshot) {
      document.getElementById("preview").src = data.screenshot;
    }
  });
}

// Load previous screenshot when popup opens
loadScreenshot();