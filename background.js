// Updated to use activeTab permission instead of tabs
// Now applies grayscale only to the current active tab instead of all tabs

// Apply grayscale to current tab
function applyGrayscaleToCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tabs[0].id, { command: 'applyGrayscale' });
        });
      }
    });
  }
  
  // Remove grayscale from current tab
  function removeGrayscaleFromCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tabs[0].id, { command: 'removeGrayscale' });
        });
      }
    });
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message) => {
    if (message.command === 'applyGrayscale') {
      applyGrayscaleToCurrentTab();
      chrome.storage.local.set({ grayscale: true });
    } else if (message.command === 'removeGrayscale') {
      removeGrayscaleFromCurrentTab();
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
  });

// Apply grayscale to all tabs without using tabs permission
// Uses chrome.windows.getAll() to retrieve tabs across all windows
// Filters tabs to only apply to HTTP/HTTPS URLs to prevent errors on special browser pages
function applyGrayscaleToAllTabs() {
    chrome.windows.getAll({ populate: true }, (windows) => {
      windows.forEach((window) => {
        window.tabs.forEach((tab) => {
          if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            }, () => {
              chrome.tabs.sendMessage(tab.id, { command: 'applyGrayscale' });
            });
          }
        });
      });
    });
  }
  
  // Remove grayscale from all tabs
  function removeGrayscaleFromAllTabs() {
    chrome.windows.getAll({ populate: true }, (windows) => {
      windows.forEach((window) => {
        window.tabs.forEach((tab) => {
          if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            }, () => {
              chrome.tabs.sendMessage(tab.id, { command: 'removeGrayscale' });
            });
          }
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
  