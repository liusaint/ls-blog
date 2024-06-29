function navigatePage(direction) {
  chrome.storage.sync.get("sites", (data) => {
    const url = new URL(window.location.href);
    const siteConfig = data.sites[url.host];
    if (siteConfig && siteConfig.enabled) {
      const selector =
        direction === "next"
          ? siteConfig.nextSelector
          : siteConfig.prevSelector;
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

  if (url.host === "web.cafe") {
    const topicElement = document.querySelector(".topic.curr .topic-title");
    const dateElement = document.querySelector(
      ".topic.curr .topic-meta:nth-child(2)"
    );
    const messageNumElement = document.querySelector(
      ".topic.curr .topic-meta:nth-child(3)"
    );
    if (topicElement && dateElement && messageNumElement) {
      document.title = `${topicElement.innerText}-${String(parseInt(messageNumElement.innerText))}-${
        dateElement.innerText
      }`;
      document
        .querySelector(".topic.curr")
        .setAttribute("style", "background:#333;color:#fff");
      document
        .querySelector(".topic.curr .topic-title")
        .setAttribute("style", "color:#fff");
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
  });
} else {
  updateDocumentTitle();
  setTimeout(updateDocumentTitle, 1000);
}
