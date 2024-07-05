function updateButtonStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    if (!url) {
      return;
    }
    const hostname = url.hostname;
    chrome.storage.local.get([hostname], function (result) {
      const isEnabled = !!result[hostname]
      const button = document.getElementById("toggle");
      button.textContent = isEnabled
        ? "Enabled"
        : "Disabled";

    });
  });
}

document.getElementById("toggle").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    if (!url) {
      return;
    }
    const hostname = url.hostname;
    chrome.storage.local.get([hostname], function (result) {
      const currentState = !!result[hostname];
      chrome.storage.local.set({ [hostname]:  !currentState?true:''}, function () {
        updateButtonStatus(); // 更新按钮状态
      });
    });
  });
});

// 当popup加载时，更新按钮的状态
document.addEventListener("DOMContentLoaded", function () {
  updateButtonStatus();
});
