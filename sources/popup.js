function toggleElementText(el, text1, text2) {
    if (el.innerHTML == text1) {
        el.innerHTML = text2;
    }
    else {
        el.innerHTML = text1;
    }
}

function isEnabled(callback) {
    chrome.storage.local.get("enabled", function(storedData) {
        callback(storedData.enabled);
    });
}

function toggleEnabled(callback) {
    isEnabled(function(enabled) {
        chrome.storage.local.set({"enabled": !enabled}, callback);
    });
}

function sendMessageToActiveTab(msg) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}

function reloadActiveTab() {
    sendMessageToActiveTab({reload: true});
}

var submitButton = document.getElementById("submitButton");
var reloadCheckbox = document.getElementById("reloadCheckbox");

isEnabled(function(enabled) {
    submitButton.innerHTML = enabled ? "Disable Translation" : "Enable Translation";
});

submitButton.addEventListener("click", function() {
    toggleElementText(submitButton, "Disable Translation", "Enable Translation");
    toggleEnabled(function() {
        if (reloadCheckbox.checked) {
            reloadActiveTab();
        }
    })
});
