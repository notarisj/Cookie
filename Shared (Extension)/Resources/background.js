// background.js
let isPaused = false;

// // Function to fetch the text file and store its data in Chrome storage
// function fetchAndStoreTextFile() {
//   fetch('https://raw.githubusercontent.com/notarisj/Cookie-Sites/main/sites.txt')
//     .then(response => response.text())
//     .then(text => {
//       // Store the text file data in Chrome storage
//       chrome.storage.local.set({ 'sitesData': text });
//     })
//     .catch(error => console.error('Error fetching the text file:', error));
// }

// // Event listener to fetch and store the text file when the extension is installed or updated
// chrome.runtime.onInstalled.addListener(fetchAndStoreTextFile);

// // Fetch and store the text file when the extension is first loaded
// fetchAndStoreTextFile();

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     chrome.tabs.sendMessage(tabId, { action: 'hideCookiePrompts' });
//   }
// });

// Used to send the initial state to content.js to initialise the observer
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.tabs.sendMessage(tabId, {
            message: "initialState",
            isPaused: isPaused,
        });
    }
});

// Function to send a message to content.js to update the observer state
function sendUpdateObserverMessage() {
    // Send message to content.js to update observer
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            message: "updateObserver",
            isPaused: isPaused,
        });
    });

    // Update UI in popup.js
    if (chrome.extension.getViews({ type: "popup" }).length > 0) {
        // If popup is open, send message to it
        chrome.runtime.sendMessage({
            message: "updateUI",
            isPaused: isPaused,
        });
    }
}

// Extension installation event
chrome.runtime.onInstalled.addListener(() => {
    console.log('YouTube Ad Skipper extension installed.');
});

// Message listener for handling state toggling and getting current state
chrome.runtime.onMessage.addListener(
    function (request, _, sendResponse) {
        if (request.message === "toggleState") {
            isPaused = !isPaused;
            sendResponse({
                state: isPaused
            });
            sendUpdateObserverMessage(); // Send message to update state
        }
        if (request.message === "getState") {
            sendResponse({
                state: isPaused
            });
        }
    }
);

// restore state
chrome.runtime.onStartup.addListener(function () {
    chrome.storage.sync.get('state', function (data) {
        if (data.state !== undefined) {
            isPaused = data.state;
            sendUpdateObserverMessage();
        }
    });
});
