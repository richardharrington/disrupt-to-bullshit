if (chrome) {
    window.browserPlugin = {
        isEnabled: function(callback) {
            chrome.storage.local.get("enabled", function(storedData) {
                callback(storedData.enabled);
            });
        },
        toggleEnabled: function(callback) {
            this.isEnabled(function(enabled) {
                chrome.storage.local.set({"enabled": !enabled}, callback);
            });
        },
        sendMessageToActiveTab: function(msg) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg);
            });
        },
        reloadActiveTab: function() {
            this.sendMessageToActiveTab({reload: true});
        },
        addMessageListener: function(callback) {
            chrome.runtime.onMessage.addListener(callback);
        }
    };
}
else {
    window.browserPlugin = {}; // not implemented yet in Firefox
}
