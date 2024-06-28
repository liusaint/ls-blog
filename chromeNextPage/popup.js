document.getElementById("site-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const site = document.getElementById("site").value;
  const prevSelector = document.getElementById("prevSelector").value;
  const nextSelector = document.getElementById("nextSelector").value;
  const enabled = document.getElementById("enabled").checked;

  chrome.storage.sync.get("sites", (data) => {
    const sites = data.sites || {};
    sites[site] = { prevSelector, nextSelector, enabled };
    chrome.storage.sync.set({ sites }, () => {
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 2000);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    const site = url.host;
    document.getElementById("site").value = site;

    chrome.storage.sync.get("sites", (data) => {
      const siteConfig = data.sites[site];
      if (siteConfig) {
        document.getElementById("prevSelector").value = siteConfig.prevSelector;
        document.getElementById("nextSelector").value = siteConfig.nextSelector;
        document.getElementById("enabled").checked = siteConfig.enabled;
      }
    });
  });
});
