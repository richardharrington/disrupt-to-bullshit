(function() {

  var DISRUPTION_SUBSTITUTIONS = (function() {

    var suffixMap = {
      ed: 'rained bullshit on',
      ively: 'by means of bullshit',
      ive: 'bullshit',
      ions: 'piles of bullshit',
      ion: 'bullshit',
      ing: 'raining bullshit on',
      or: 'bullshitter',
      s: 'rains bullshit on'
    };

    var suffixes = Object.keys(suffixMap);
    var disruptWithSuffixes = new RegExp("\\b([Dd])isrupt(" + suffixes.join("|") + ")?\\b", "g");

    var substitutions = [

      [ /Disrupt\s+(NY|SF|New York|San Francisco|Europe|Beijing)/g, 'Bullshitpalooza $1' ],
      [ /TechCrunch\s+Disrupt/g, 'BullshitPalooza' ],

      // "<helping verb> <optional adverb> disrupted" =>
      // "<helping verb> <optional adverb> covered in bullshit"
      [ /(be|being|been|is|are|were|get|gets)\s+(\w+\s+)?disrupted/g, '$1 $2 covered in bullshit' ],
      [ /(Be|Being|Been|Is|Are|Were|Get|Gets)\s+(\w+\s+)?Disrupted/g, '$1 $2 Covered in Bullshit' ],

      [ /so disruptive/g, 'such bullshit' ],
      [ /So Disruptive/g, 'Such Bullshit' ],
      [ /so disruptively/g, 'by means of such bullshit' ],
      [ /So Disruptively/g, 'by Means of Such Bullshit' ],
      [ /-disrupting/g, '-bullshitting' ],
      [ /-Disrupting/g, '-Bullshitting' ],
      [ /disrupt\b/g, 'rain bullshit on' ],
      [ /Disrupt\b/g, 'Rain Bullshit on' ],

      [ disruptWithSuffixes, function(_, firstLetter, suffix) {
          var isUpperCase = firstLetter === 'D';
          var phrase = suffixMap[suffix];
          return isUpperCase ? capitalizePhrase(phrase) : phrase;
      }]
    ];

    function capitalizePhrase(phrase) {
      return phrase.split(' ').map(function(word) {
        return (word.length > 2) ? capitalizeWord(word) : word;
      }).join(' ');
    }

    function capitalizeWord(word) {
      var firstLetterCode = word.charCodeAt(0);
      var capitalizedFirstLetter = String.fromCharCode(firstLetterCode - 32);
      return capitalizedFirstLetter + word.substr(1);
    }

    return {
      substitute: function(originalText) {
        return substitutions.reduce(function(text, substitution) {
          return text.replace(substitution[0], substitution[1]);
        }, originalText);
      }
    };
  }());

  // ---------------------------------------------

  makeItSo();

  // ---------------------------------------------

  function makeItSo() {
    walkTextNodes(document.body, function(node) {
      node.nodeValue = DISRUPTION_SUBSTITUTIONS.substitute(node.nodeValue);
    });
  }

  function walkTextNodes(root, callback) {
    var scriptNodeBlocker = {
      acceptNode: function(node) {
        return isScriptNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    };

    var node;
    var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, scriptNodeBlocker, false);
    while (node = treeWalker.nextNode())
      callback(node);
  }

  function isScriptNode(node) {
    return node.parentElement.tagName.toLowerCase() === "script";
  }

})();

