function clickButton() {
  chrome.storage.sync.get('enabled', (data) => {
    if (data.enabled) {
      const buttons = document.querySelectorAll('.btn.relative.btn-secondary');
      let targetButton = null;

      buttons.forEach(button => {
        if (button.textContent.includes('继续生成')) {
          targetButton = button;
        }
      });

      if (targetButton) {
        targetButton.click();
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
