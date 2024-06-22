function clickButton() {
  chrome.storage.sync.get('enabled', (data) => {
    if (data.enabled) {
      const button = document.querySelector('.absolute button.relative.btn-secondary');
      if (button) {
        button.click();
        console.log('Button clicked');
        // 8 seconds later, check and click again
        setTimeout(clickButton, 8000);
      } else {
        console.log('Button not found');
        // Retry after 2 seconds if button not found
        setTimeout(clickButton, 2000);
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
