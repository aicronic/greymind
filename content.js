// Apply grayscale effect
function applyGrayscale() {
    document.body.style.filter = 'grayscale(100%)';
    document.documentElement.style.filter = 'grayscale(100%)';
  }
  
  // Remove grayscale effect
  function removeGrayscale() {
    document.documentElement.style.filter = '';
    document.body.style.filter = '';
  }
  
  // Listen for messages from the background script to toggle grayscale
  chrome.runtime.onMessage.addListener((message) => {
    if (message.command === 'applyGrayscale') {
      applyGrayscale();
    } else if (message.command === 'removeGrayscale') {
      removeGrayscale();
    }
  });
  
  // Ensure grayscale is applied when the content script is loaded
  chrome.storage.local.get(['grayscale'], (result) => {
    if (result.grayscale) {
      applyGrayscale();
    }

    // Check grayscale state when popup is opened
chrome.storage.local.get(['grayscale'], (result) => {
    updateUI(result.grayscale);
  });

    // Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.grayscale) {
      if (changes.grayscale.newValue) {
        applyGrayscale();
      } else {
        removeGrayscale();
      }
    }
  });
  });
  