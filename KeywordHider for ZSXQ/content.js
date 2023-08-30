function hideKeywords() {
  chrome.storage.local.get(['keywords'], function (result) {
    let keywords = result.keywords || [];
    let elements = document.querySelectorAll('app-topic[type=flow]');
    
    elements.forEach((element) => {
      let content = element.querySelector('.content');
      if (content) {
        let text = content.innerText;
        if (keywords.some((keyword) => text.includes(keyword))) {
          element.style.display = 'none';
        }
      }
    });
  });
}

// Auto-run when the content script is injected
hideKeywords();

// To handle dynamic loading
const observer = new MutationObserver(hideKeywords);
observer.observe(document.body, { childList: true, subtree: true });
