window.walkTextNodes = function(root, callback) {
  var scriptNodeBlocker = {
    acceptNode: function(node) {
      return node.parentElement.tagName.toLowerCase() === "script" ?
             NodeFilter.FILTER_REJECT :
             NodeFilter.FILTER_ACCEPT;
    }
  };

  var node;
  var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, scriptNodeBlocker, false);
  while (node = treeWalker.nextNode())
    callback(node);
}
