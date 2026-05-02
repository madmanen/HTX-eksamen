chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "getTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const url = tabs[0].url;
        // Send URL to the content script
        chrome.tabs.sendMessage({action: "receiveUrl",data: url});
        }
    });
  }
});