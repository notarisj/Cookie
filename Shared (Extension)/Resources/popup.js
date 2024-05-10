// popup.js

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({
        message: "getState"
    }, function (response) {
        updateButtonLabel(response.state);
        console.log('DOMContentLoaded: State updated to ', response.state);
    });
});

// Event listener for pause-resume click
document.getElementById('pause-resume').addEventListener('click', function () {
    chrome.runtime.sendMessage({
        message: "toggleState"
    }, function (response) {
        chrome.storage.sync.set({ state: response.state });
        updateButtonLabel(response.state);
        console.log('Pause button clicked: State toggled to ', response.state);
    });
});

/**
 * @function updateButtonLabel
 * @description Updates the button label based on the extension state.
 * @param {boolean} isPaused - The current state of the extension.
 */
function updateButtonLabel(isPaused) {
    if (isPaused) {
        document.getElementById('pause-resume').textContent = "Resume";
    } else {
        document.getElementById('pause-resume').textContent = "Pause";
    }
    console.log('Button label updated: ', isPaused ? 'Resume' : 'Pause');
}
