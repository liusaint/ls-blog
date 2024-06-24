let timer = null;
lastClickTime = 0;
function clickButton() {
  chrome.storage.sync.get("enabled", (data) => {
    if (data.enabled) {
      const buttons = document.querySelectorAll(".btn.relative.btn-secondary");
      let targetButton = null;

      buttons.forEach((button) => {
        if (button.textContent.includes("继续生成")) {
          targetButton = button;
        }
      });

      if (targetButton) {
        if (Date.now() - lastClickTime < 5000) {
          console.log("Button clicked too soon");
          return;
        }
        targetButton.click();
        lastClickTime = Date.now();
        console.log("Button clicked");
        // 30 seconds later, check and click again
        clearTimeout(timer);
        timer = setTimeout(clickButton, 40000);
      } else {
        console.log("Button not found");
        clearTimeout(timer);
        // Retry after 2 seconds if button not found
        timer = setTimeout(clickButton, 2000);
      }
    }
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    clickButton();
  }
});

// Initial call to function
clickButton();
