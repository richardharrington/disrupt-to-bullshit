(function() {
  var disruptToBullshit = window.createVerbConverter(window.DISRUPT_TO_BULLSHIT_RULES);
  window.walkTextNodes(document.body, function(node) {
    node.nodeValue = disruptToBullshit(node.nodeValue);
  });
})();

