(function() {

  var DISRUPTION_SUBSTITUTIONS = (function() {

    var specialSubstitutions = [
      [ /Disrupt\s+(NY|SF|New\s+York|San\s+Francisco|Europe|Beijing|Hardware|Battlefield)/g,
              'Bullshitpalooza $1' ],
      [ /TechCrunch\s+Disrupt/g, 'TechCrunch Bullshitpalooza' ]
    ];

    var exactPhraseMap = {
      'so disruptive': 'such bullshit',
      'so disruptively': 'by means of such bullshit',
      '-disrupting': '-bullshitting',
      'disrupt': 'rain bullshit on'
    };

    var pastParticipleSubstitution = 'covered in bullshit';
    var helpingVerbs = ['being', 'been', 'be', 'is', 'are', 'were', 'gets', 'get'];

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
    var suffixes = Object.keys(suffixMap);

    // "<helping verb> <optional adverb> disrupted"
    var pastParticipleRegExp =
            new RegExp("\\b(" + altMatches(helpingVerbs) + ")\\s+(\\w+\\s+)?disrupted\\b", "gi");

    var exactPhrasesRegExp =
            new RegExp("\\b" + altMatches(exactPhrases) + "\\b", "gi");

    var disruptWithSuffixesRegExp =
            new RegExp("\\bdisrupt(" + altMatches(suffixes) + ")\\b", "gi");

    var substitutions = specialSubstitutions.concat([

      [ pastParticipleRegExp, substituteWithCorrectCase(function(_, helpingVerb, adverb) {
          return helpingVerb.toLowerCase() + ' ' +
                 (adverb || '').toLowerCase() + ' ' +
                 pastParticipleSubstitution;
      })],

      [ exactPhrasesRegExp, substituteWithCorrectCase(function(wholeMatch) {
          return exactPhraseMap[wholeMatch.toLowerCase()];
      })],

      [ disruptWithSuffixesRegExp, substituteWithCorrectCase(function(_, suffix) {
          return suffixMap[suffix];
      })]

    ]);

    function substituteWithCorrectCase(f) {
      return function(wholeMatch /* plus other variadic args */) {
        var args = Array.prototype.slice.call(arguments);
        var substitution = f.apply(null, args);
        var isDisruptCapitalized = wholeMatch.indexOf('Disrupt') !== -1;
        return isDisruptCapitalized ? capitalizePhrase(substitution) : substitution;
      }
    }

    function altMatches(strs) {
      return strs.join("|");
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
      var result = word.substr(0, firstLetterIdx) + capitalizedFirstLetter + word.substr(firstLetterIdx + 1);
      return result;
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

