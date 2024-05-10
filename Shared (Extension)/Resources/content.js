// content.js
let isPaused = false;
let _debug = true;

// Function to fetch the text file and store its data in Chrome storage
function fetchAndStoreTextFile() {
  fetch('https://raw.githubusercontent.com/notarisj/Cookie-Sites/main/sites.txt')
    .then(response => response.text())
    .then(text => {
      // Store the text file data in Chrome storage
      chrome.storage.local.set({sitesData: text}, function() {
        if (_debug) {
          console.log('Sites data stored in Chrome storage.');
        }
      });
    })
    .catch(error => console.error('Error fetching the text file:', error));
}

// Fetch and store the text file when the script is first loaded
fetchAndStoreTextFile();

// Function to hide cookie prompts based on stored data
function hideCookiePrompts() {
  chrome.storage.local.get(['sitesData'], function(result) {
    const sitesArray = result.sitesData.split('\n');
    sitesArray.forEach(siteData => {
      const [siteUrl, ...elementIds] = siteData.split(',');
      // Check if the current site matches the site in the data
      if (window.location.hostname.includes(siteUrl.trim())) {
        // If it matches, only then remove the elements
        elementIds.forEach(id => {
          let element = document.getElementById(id.trim());
          if (!element) {
            element = document.querySelector('.' + id.trim().replace(/ /g, '.'));
          }
          if (!element) {
            element = document.querySelector(id.trim());
          }
          if (element) {
            element.remove();
          }
        });
      }
    });
  });
}

const config = { childList: true, subtree: true };
let observer = new MutationObserver(handleMutations);

chrome.runtime.onMessage.addListener(function (request) {
  if (request.message === 'updateObserver') {
      if (request.isPaused) {
          observer.disconnect();
          if (_debug) {
              console.log('Observer disconnected.');
          }
      } else {
          observer.observe(document.body, config);
          hideCookiePrompts();
          if (_debug) {
              console.log('Observer reconnected.');
          }
      }
  } else if (request.message === 'initialState') {
      if (_debug) {
          console.log('Initial state (isPaused): ' + request.isPaused);
      }
      if (!request.isPaused) {
          observer.observe(document.body, config);
          hideCookiePrompts();
      }
  }
});

function handleMutations(mutationsList, observer) {
  for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(addedNode => {
            hideCookiePrompts();
          });
      }
  }
}