document.addEventListener('DOMContentLoaded', function () {
  // Load existing keywords
  chrome.storage.local.get(['keywords'], function (result) {
    const tags = result.keywords || [];
    tags.forEach(addTag);
  });

  // Add keyword button
  document.getElementById('addKeyword').addEventListener('click', function () {
    const keyword = document.getElementById('keywordInput').value;
    addAndSaveTag(keyword);
  });

  // Add keyword on enter
  document.getElementById('keywordInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const keyword = document.getElementById('keywordInput').value;
      addAndSaveTag(keyword);
    }
  });
});

function addTag(keyword) {
  const tag = document.createElement('div');
  tag.className = 'tag';
  
  const text = document.createElement('span');
  text.innerText = keyword;
  tag.appendChild(text);
  
  const removeIcon = document.createElement('span');
  removeIcon.className = 'remove-icon';
  removeIcon.innerText = '✕';
  removeIcon.onclick = function() {
    tag.remove();
    saveTags();
    updateContent();
  };

  tag.appendChild(removeIcon);
  
  document.getElementById('tags').appendChild(tag);
}

function addAndSaveTag(keyword) {
  if (keyword) {
    const tagsElement = document.querySelectorAll('.tag > span:first-child');
    const tags = Array.from(tagsElement).map(e => e.innerText);
    if (!tags.includes(keyword)) {
      addTag(keyword);
      saveTags();
      updateContent();
      // Clear input
      document.getElementById('keywordInput').value = '';
    }
  }
}

function saveTags() {
  const tagsElement = document.querySelectorAll('.tag > span:first-child');
  const tags = Array.from(tagsElement).map(e => e.innerText);
  chrome.storage.local.set({ keywords: tags });
}

function updateContent() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "reloadKeywords" });
  });
}
