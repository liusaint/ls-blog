chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.includes('trends.google.com/trends/explore')) {
        chrome.tabs.sendMessage(tabId, { type: 'checkHideGeoMap' });
    }
});
