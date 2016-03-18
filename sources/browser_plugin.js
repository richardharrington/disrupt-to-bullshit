window.browserPlugin = (function() {
    var chromeExtension = {
        isDisabled: function(callback) {
            chrome.storage.local.get("disabled", function(storedData) {
                callback(storedData.disabled);
            });
        },
        toggleDisabled: function(callback) {
            this.isDisabled(function(disabled) {
                chrome.storage.local.set({"disabled": !disabled}, callback);
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
    var firefoxAddon = {}; // not implemented yet

    return chrome ? chromeExtension : firefoxAddon;
})();
