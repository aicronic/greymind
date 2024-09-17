// Apply grayscale to all tabs
function applyGrayscaleToAllTabs() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tab.id, { command: 'applyGrayscale' });
        });
      });
    });
  }
  
  // Remove grayscale from all tabs
  function removeGrayscaleFromAllTabs() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tab.id, { command: 'removeGrayscale' });
        });
      });
    });
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message) => {
    if (message.command === 'applyGrayscale') {
      applyGrayscaleToAllTabs();
      chrome.storage.local.set({ grayscale: true });
    } else if (message.command === 'removeGrayscale') {
      removeGrayscaleFromAllTabs();
      chrome.storage.local.set({ grayscale: false });
    }
  });
  
  // Apply grayscale on tab update and activation
  chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    }, () => {
      chrome.storage.local.get(['grayscale'], (result) => {
        if (result.grayscale) {
          chrome.tabs.sendMessage(details.tabId, { command: 'applyGrayscale' });
        }
      });
    });
  }, { url: [{ schemes: ['http', 'https'] }] });
  