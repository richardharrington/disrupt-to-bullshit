// Copyright (c) 2014 Richard Harrington.
// Use of this source code is governed by the Mozilla Public License 2.0.

// (and inspired by people who made Cloud to Butt.)

(function(globalNamespace) {

    var DISRUPT_TO_BULLSHIT_RULES = globalNamespace.DISRUPT_TO_BULLSHIT_RULES;
    var walkTextNodes = globalNamespace.walkTextNodes;
    var createVerbConverter = globalNamespace.createVerbConverter;

    var disruptToBullshit = createVerbConverter(DISRUPT_TO_BULLSHIT_RULES);

    chrome.storage.local.get("enabled", function(storedData) {
        if (storedData.enabled) {
            walkTextNodes(document.body, function(node) {
                node.nodeValue = disruptToBullshit(node.nodeValue);
            });
        }
    });

    chrome.runtime.onMessage.addListener(function(request) {
        if (request.reload) {
            window.location.reload();
        }
    });

})(window);
