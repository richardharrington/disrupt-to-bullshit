(function() {
  var createVerbConverter = window.createVerbConverter;
  var DISRUPT_TO_BULLSHIT_RULES = window.DISRUPT_TO_BULLSHIT_RULES;
  var walkTextNodes = window.walkTextNodes;

  var disruptToBullshit = createVerbConverter(DISRUPT_TO_BULLSHIT_RULES);
  var lastY = 0;
  var hasScrolled = false;

  refresh();
  window.addEventListener('scroll', startPollingTheFirstTimeWeScroll);

  function refresh() {
    walkTextNodes(document.body, function(node) {
      node.nodeValue = disruptToBullshit(node.nodeValue);
    });
  };

  function startPollingTheFirstTimeWeScroll() {
    if (hasScrolled)
      return;
    hasScrolled = true;
    setInterval(refreshIfWeHaveJumpedUpOrDownAScreen, 1000);
  }

  function refreshIfWeHaveJumpedUpOrDownAScreen() {
    if (Math.abs(window.scrollY - lastY) > window.innerHeight) {
      lastY = window.scrollY;
      refresh();
    }
  }

})();


