document.addEventListener("DOMContentLoaded", () => {
  // Ask Chrome to capture screenshot when popup opens
  chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
    if (dataUrl) {
      const img = document.createElement("img");
      img.src = dataUrl;
      const preview = document.getElementById("preview");
      preview.innerHTML = "";
      preview.appendChild(img);
    } else {
      document.getElementById("preview").innerText = "Failed to take screenshot.";
    }
  });
});
