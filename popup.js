function updateUI(isGrayscale) {
    if (isGrayscale) {
      document.getElementById('toggle-all-tabs').style.display = 'none';
      document.getElementById('toggle-active-tab').style.display = 'none';
      document.getElementById('stop-grayscale').style.display = 'block';
      document.body.classList.add('grayscale-active');
    } else {
      document.getElementById('toggle-all-tabs').style.display = 'block';
      document.getElementById('toggle-active-tab').style.display = 'block';
      document.getElementById('stop-grayscale').style.display = 'none';
      document.body.classList.remove('grayscale-active');
    }
  }
  
  // Check grayscale state when popup is opened
  chrome.storage.local.get(['grayscale'], (result) => {
    updateUI(result.grayscale);
  });
  
  document.getElementById('toggle-active-tab').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tab.id, { command: 'applyGrayscale' });
      chrome.storage.local.set({ grayscale: true }, () => {
        updateUI(true);
      });
    });
  });
  
  document.getElementById('toggle-all-tabs').addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'applyGrayscale' });
    chrome.storage.local.set({ grayscale: true }, () => {
      updateUI(true);
    });
  });
  
  document.getElementById('stop-grayscale').addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'removeGrayscale' });
    chrome.storage.local.set({ grayscale: false }, () => {
      updateUI(false);
    });
  });