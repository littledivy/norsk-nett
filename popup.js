// Function to toggle translations on/off
document.getElementById("toggleTranslation").addEventListener(
  "change",
  function () {
    chrome.storage.sync.set({ enabled: this.checked });
  },
);

// Initialize the checkbox state on load
chrome.storage.sync.get("enabled", function (data) {
  document.getElementById("toggleTranslation").checked = data.enabled !== false;
});
