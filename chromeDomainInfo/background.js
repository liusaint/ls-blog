// Function to fetch URL creation date using the provided API
async function getUrlCreationDate(url) {
  const apiUrl = `https://whois.4.cn/api/main?domain=${url}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.retcode === 0 && data.data && data.data.create_date) {
      console.log(data.data.create_date);
      return data.data.create_date;
    } else {
      throw new Error('No creation date found');
    }
  } catch (error) {
    console.error('Error fetching URL creation date:', error);
    throw error;
  }
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['styles.css']
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.url) {
    getUrlCreationDate(message.url).then((creationDate) => {
      sendResponse({ creationDate: creationDate });
    }).catch((error) => {
      sendResponse({ error: error.message });
    });
    return true; // Will respond asynchronously
  }
});