chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear();  // 安装时清除存储，可根据需要去掉这一行
});
