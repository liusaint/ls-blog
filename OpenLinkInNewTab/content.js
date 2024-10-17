function shouldModifyBehavior() {
  return new Promise((resolve) => {
    const hostname = new URL(window.location.href).hostname;
    chrome.storage.local.get([hostname], function (result) {
      resolve(result[hostname] !== false); // 默认为 true，除非明确设置为 false
    });
  });
}

let domainList = [];

let getStorageDomain = () => {
  chrome.storage.local.get(null, function (result) {
    domainList = Object.keys(result).filter((key) => !!result[key]);
  });
};

let timer = null;
let getDomainList = function () {
  timer = setTimeout(() => {
    getDomainList();
  }, 5000);
};

getStorageDomain();

document.body.addEventListener(
  "click",
  function (event) {
    let targetElement = event.target;
    let linkElement = null;

    // 检查点击元素本身或其父元素是否为 A 标签
    while (targetElement && targetElement !== document.body) {
      if (targetElement.tagName === "A") {
        linkElement = targetElement;
        break;
      }
      targetElement = targetElement.parentElement;
    }

    if (
      linkElement &&
      linkElement.href &&
      !linkElement.target
    ) {
      const hostname = new URL(window.location.href).hostname;
      if (domainList.includes(hostname)) {
        event.preventDefault(); // 确保阻止默认行为
        event.stopPropagation();
        window.open(linkElement.href, "_blank"); // 在新窗口中打开链接
      }
    }
  },
  true
); // 使用捕获模式监听，确保在默认行为之前触发
