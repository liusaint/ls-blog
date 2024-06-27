function navigatePage(direction) {
    chrome.storage.sync.get("sites", (data) => {
      const url = new URL(window.location.href);
      const siteConfig = data.sites[url.host];
      if (siteConfig && siteConfig.enabled) {
        const selector = direction === "next" ? siteConfig.nextSelector : siteConfig.prevSelector;
        const button = document.querySelector(selector);
        if (button) {
          button.click();
        } else {
          console.log("Button not found for selector:", selector);
        }
      }
    });
  }
  
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      navigatePage("next");
    } else if (event.key === "ArrowLeft") {
      navigatePage("prev");
    }
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.sites) {
      console.log("Site configuration updated:", changes.sites.newValue);
    }
  });
  