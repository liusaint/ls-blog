function hideKeywords() {
  chrome.storage.local.get(['keywords'], function (result) {
    let keywords = result.keywords || [];
    let elements = document.querySelectorAll('app-topic[type=flow]');
    
    elements.forEach((element) => {
      let content = element.querySelector('.content');
      if (content) {
        let text = content.innerText.toLowerCase(); // convert to lowercase
        if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) { // convert keyword to lowercase
          element.style.display = 'none';
        }else{
          element.style.display = 'block';
        }
      }
    });
  });
}

// Auto-run when the content script is injected
hideKeywords();

// New code
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "reloadKeywords") {
      hideKeywords();
    }
  }
);

// To handle dynamic loading
const observer = new MutationObserver(hideKeywords);
observer.observe(document.body, { childList: true, subtree: true });
