document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  
  chrome.storage.sync.get('enabled', (data) => {
    updateButton(data.enabled);
  });

  toggleButton.addEventListener('click', () => {
    chrome.storage.sync.get('enabled', (data) => {
      const newValue = !data.enabled;
      chrome.storage.sync.set({ enabled: newValue }, () => {
        updateButton(newValue);
        chrome.tabs.query({ url: "https://chatgpt.com/*" }, (tabs) => {
          for (let tab of tabs) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            });
          }
        });
      });
    });
  });

  function updateButton(enabled) {
    toggleButton.textContent = enabled ? 'Disable Auto Clicker' : 'Enable Auto Clicker';
  }
});
