// 检查并隐藏地图区域
function checkAndHideGeoMap() {
    
    chrome.storage.local.get('hideGeoMap', ({ hideGeoMap }) => {
        if (hideGeoMap) {
            if (!document.getElementById('hide-geo-map-style')) {
                const style = document.createElement('style');
                style.id = 'hide-geo-map-style';
                style.textContent = '.widget-container:has(trends-widget[widget-name^="GEO_MAP"]) { display: none !important; }';
                document.head.appendChild(style);
            }
        } else {
            const style = document.getElementById('hide-geo-map-style');
            if (style) {
                style.remove();
            }
        }
    });
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'checkHideGeoMap') {
        checkAndHideGeoMap();
    }
});

// 初始检查
checkAndHideGeoMap();
