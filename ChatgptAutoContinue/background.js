chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.enabled) {
      chrome.tabs.query({ url: "https://chatgpt.com/*" }, (tabs) => {
        for (let tab of tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
        }
      });
    }
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get('enabled', (data) => {
      const newValue = !data.enabled;
      chrome.storage.sync.set({ enabled: newValue }, () => {
        console.log(`Auto Clicker is now ${newValue ? 'enabled' : 'disabled'}`);
      });
    });
  });
  