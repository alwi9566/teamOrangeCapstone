chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
    // Save screenshot temporarily in storage
    chrome.storage.local.set({ latestScreenshot: dataUrl }, () => {
      // Open the popup.html to show preview
      chrome.windows.create({
        url: "popup.html",
        type: "popup",
        width: 800,
        height: 600
      });
    });
  });
});

