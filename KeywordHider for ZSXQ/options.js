document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(['keywords'], function (result) {
    if (result && result.keywords) {
      document.getElementById('keywords').value = result.keywords.join('\n');
    }
  });

  document.getElementById('save').addEventListener('click', function () {
    let keywords = document.getElementById('keywords').value.split('\n');
    chrome.storage.local.set({ keywords }, function () {
      alert('Keywords saved.');
    });
  });
});
