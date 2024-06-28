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

function updateDocumentTitle() {
  const url = new URL(window.location.href);
  debugger
  if (url.host === "web.cafe") {
    debugger
    const topicElement = document.querySelector(".topic.curr .topic-title");
    const dateElement = document.querySelector(".topic.curr .topic-meta:nth-child(2)");
    if (topicElement && dateElement) {
      document.title = `${topicElement.innerText} - ${dateElement.innerText}`;
    }
  }
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    updateDocumentTitle();
    setTimeout(updateDocumentTitle, 1000);
  });
} else {
  updateDocumentTitle();
  setTimeout(updateDocumentTitle, 1000);
}
