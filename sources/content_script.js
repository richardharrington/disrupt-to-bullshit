// Copyright (c) 2014 Richard Harrington.
// Use of this source code is governed by the Mozilla Public License 2.0.

// (and inspired by people who made Cloud to Butt.)

browserPlugin.addMessageListener(function(msg) {
    if (msg.reload) {
        window.location.reload();
    }
});

browserPlugin.isEnabled(function(enabled) {
    if (enabled) {
        var convert = createVerbConverter(CONVERSION_RULES);
        walkTextNodes(document.body, function(node) {
            node.nodeValue = convert(node.nodeValue);
        });
    }
});
