// Function to check if a URL is less than 6 months old
function isRecent(urlCreationDate) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);
  return new Date(urlCreationDate) > sixMonthsAgo;
}

// Function to fetch URL creation date
async function fetchUrlCreationDate(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ url: url }, (response) => {
      if (response && response.creationDate) {
        resolve(response.creationDate);
      } else {
        reject('No creation date found');
      }
    });
  });
}

// Function to extract domain from URL
function extractDomain(url) {
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return domain.split('/')[0];
}

// Function to check if it's a second-level domain
function isSecondLevelDomain(domain) {
  const parts = domain.split('.');
  return parts.length > 2;
}

// Function to get domain info from storage or fetch it
async function getDomainInfo(domain) {
  return new Promise((resolve) => {
    chrome.storage.local.get(domain, async (result) => {
      if (result[domain]) {
        console.log(`Retrieved domain info for ${domain} from storage.`);
        resolve(result[domain]);
      } else {
        try {
          console.log(`Fetching creation date for ${domain}...`);
          const creationDate = await fetchUrlCreationDate(domain);
          const domainInfo = { creationDate, fetchDate: new Date().toISOString() };
          chrome.storage.local.set({ [domain]: domainInfo });
          resolve(domainInfo);
        } catch (error) {
          console.error(`Error fetching creation date for ${domain}:`, error);
          resolve(null);
        }
      }
    });
  });
}

// Function to highlight recent URLs and append creation date
async function highlightRecentUrls() {
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const links = document.querySelectorAll('a[href]');
  console.log(`Found ${links.length} links on the page.`);
  let count = 0;

  for (const link of links) {
    const textContent = link.textContent.trim();
    const domain = extractDomain(textContent);

    if (domainRegex.test(domain) && !isSecondLevelDomain(domain)) {
      count++;
      const domainInfo = await getDomainInfo(domain);
      if (domainInfo) {
        const { creationDate } = domainInfo;
        const formattedDate = new Date(creationDate).toLocaleDateString();
        link.textContent = `${textContent} (${formattedDate})`;
        if (isRecent(creationDate)) {
          link.classList.add('recent-url');
        }
      }
    }
  }
  console.log(`Found ${count} URLs with domain information.`);
}

// 立即执行 highlightRecentUrls 函数
highlightRecentUrls();