(function() {

  var DISRUPTION_SUBSTITUTIONS = (function() {

    var exactPhraseMap = {
      'so disruptive': 'such bullshit',
      'so disruptively': 'by means of such bullshit',
      '-disrupting': '-bullshitting',
      'disrupt': 'rain bullshit on'
    };

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

    var exactPhrases = Object.keys(exactPhraseMap);
    var exactPhrasesRegExp = new RegExp("\\b" + exactPhrases.join("|") + "\\b", "gi");

    var suffixes = Object.keys(suffixMap);
    var disruptWithSuffixesRegExp = new RegExp("\\bdisrupt(" + suffixes.join("|") + ")\\b", "gi");

    var substitutions = [

      [ /Disrupt\s+(NY|SF|New York|San Francisco|Europe|Beijing)/g, 'Bullshitpalooza $1' ],
      [ /TechCrunch\s+Disrupt/g, 'Bullshitpalooza' ],

      // "<helping verb> <optional adverb> disrupted" =>
      // "<helping verb> <optional adverb> covered in bullshit"
      [ /(be|being|been|is|are|were|get|gets)\s+(\w+\s+)?disrupted/g, '$1 $2 covered in bullshit' ],
      [ /(Be|Being|Been|Is|Are|Were|Get|Gets)\s+(\w+\s+)?Disrupted/g, '$1 $2 Covered in Bullshit' ],

      [ exactPhrasesRegExp, function(wholeMatch) {
          var substitution = exactPhraseMap[wholeMatch];
          return isDisruptCapitalized(wholeMatch) ? capitalizePhrase(substitution) : substitution;
      }],

      [ disruptWithSuffixesRegExp, function(wholeMatch, suffix) {
          var substitution = suffixMap[suffix];
          return isDisruptCapitalized(wholeMatch) ? capitalizePhrase(substitution) : substitution;
      }]
    ];

    function isDisruptCapitalized(phrase) {
      return phrase.indexOf('Disrupt') !== -1;
    }

    function capitalizePhrase(phrase) {
      return phrase.split(' ').map(function(word) {
        return (word.length > 2) ? capitalizeWord(word) : word;
      }).join(' ');
    }

    function capitalizeWord(word) {
      // string can begin with hyphen in the case of "-disrupting"
      var firstLetterIdx = (word[0] === '-') ? 1 : 0;
      var firstLetterCode = word.charCodeAt(firstLetterIdx);
      var capitalizedFirstLetter = String.fromCharCode(firstLetterCode - 32);
      return word.substr(0, firstLetterIdx) + capitalizedFirstLetter + word.substr(firstLetterIdx + 1);
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

