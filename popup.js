// Cache the buttons for easier manipulation
const toggleActiveButton = document.getElementById('toggle-active-tab');
const toggleAllButton = document.getElementById('toggle-all-tabs');
const stopButton = document.getElementById('stop-grayscale');

// Event listener for "Set Grayscale for Active Tab" button
toggleActiveButton.addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject the script to toggle grayscale on the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: applyGrayscale
  });

  // Show the stop button and hide the other buttons
  toggleAllButton.style.display = 'none';
  toggleActiveButton.style.display = 'none';
  stopButton.style.display = 'inline';
});

// Event listener for "Set Grayscale for All Open Tabs" button
toggleAllButton.addEventListener('click', async () => {
  // Get all open tabs
  const tabs = await chrome.tabs.query({});

  // Loop through each tab and inject the grayscale function
  for (let tab of tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: applyGrayscale
    });
  }

  // Show the stop button and hide the other buttons
  toggleAllButton.style.display = 'none';
  toggleActiveButton.style.display = 'none';
  stopButton.style.display = 'inline';
});

// Event listener for "Stop Grayscale" button
stopButton.addEventListener('click', async () => {
  // Get all open tabs
  const tabs = await chrome.tabs.query({});

  // Loop through each tab and inject the function to remove the grayscale filter
  for (let tab of tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: removeGrayscale
    });
  }

  // Show both options and hide the stop button
  toggleAllButton.style.display = 'inline';
  toggleActiveButton.style.display = 'inline';
  stopButton.style.display = 'none';
});

// Function to apply grayscale on the page
function applyGrayscale() {
  document.body.style.filter = 'grayscale(100%)';
}

// Function to remove grayscale from the page
function removeGrayscale() {
  document.body.style.filter = '';
}
