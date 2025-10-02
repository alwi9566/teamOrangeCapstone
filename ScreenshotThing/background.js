chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "capture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      // Save screenshot in storage
      chrome.storage.local.set({ screenshot: dataUrl }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // keeps the message channel open for async response
  }
});
