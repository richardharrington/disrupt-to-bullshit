(function() {

  var DISRUPTION_SUBSTITUTIONS = (function() {

    // TODO: add more special substitutions here to detect Disrupt, the conference. Might
    // have to add an extra function outside the whole regexp reduction entirely, which would
    // be part of "substitute" below and would check the ratio of lower- to upper-case words
    // in the node. (other thing we need to check is if it's preceded by a preposition).

    var specialSubs = [
      [ /Disrupt\s+(NY|SF|New\s+York|San\s+Francisco|Europe|Beijing|Hardware|Battlefield)/g,
              'Bullshitpalooza $1' ],
      [ /TechCrunch\s+Disrupt/g, 'TechCrunch Bullshitpalooza' ]
    ];

    var rootVerb = 'disrupt';

    var helpingVerbs = ['being', 'been', 'be', 'is', 'are', 'were', 'gets', 'get'];

    var pastParticipleMapLower = {
      'disrupted': 'covered in bullshit'
    };

    var exactPhraseMapLower = {
      'so disruptive': 'such bullshit',
      'so disruptively': 'by means of such bullshit',
      '-disrupting': '-bullshitting',
      'disrupt': 'rain bullshit on'
    };

    var suffixMapLower = {
      ed: 'rained bullshit on',
      ively: 'by means of bullshit',
      ive: 'bullshit',
      ions: 'piles of bullshit',
      ion: 'bullshit',
      ing: 'raining bullshit on',
      or: 'bullshitter',
      er: 'bullshitter',
      ors: 'bullshitters',
      ers: 'bullshitters',
      s: 'rains bullshit on'
    };

    var pastParticiple = Object.keys(pastParticipleMapLower)[0];
    var exactPhraseKeys = Object.keys(exactPhraseMapLower);
    var suffixKeys = Object.keys(suffixMapLower);

    var pastParticipleMapUpper = mapToUpper(pastParticipleMapLower);
    var exactPhraseMapUpper = mapToUpper(exactPhraseMapLower);
    var suffixMapUpper = mapToUpper(suffixMapLower);

    // e.g. "<helping verb> <optional adverb> disrupted"
    var pastParticiplePhraseRegExp =
            new RegExp("\\b(" + altMatches(helpingVerbs) + ")\\s+(\\w+\\s+)?" + pastParticiple + "\\b", "gi");

    var exactPhraseKeysRegExp =
            new RegExp("\\b" + altMatches(exactPhraseKeys) + "\\b", "gi");

    var disruptWithSuffixesRegExp =
            new RegExp("\\b" + rootVerb + "(" + altMatches(suffixKeys) + ")\\b", "gi");

    var substitutions = specialSubs.concat([

      [ pastParticiplePhraseRegExp, function(wholeMatch, helpingVerb, adverb) {
          var pastParticipleSub = isVerbLowerCase(wholeMatch) ?
                  pastParticipleMapLower[pastParticiple] :
                  pastParticipleMapUpper[pastParticiple];
          return helpingVerb + ' ' + (adverb || '') + ' ' + pastParticipleSub;
      }],

      [ exactPhraseKeysRegExp, function(wholeMatch) {
          var phraseKey = wholeMatch.toLowerCase();
          return isVerbLowerCase(wholeMatch) ? exactPhraseMapLower[phraseKey] : exactPhraseMapUpper[phraseKey];
      }],

      [ disruptWithSuffixesRegExp, function(wholeMatch, suffix) {
          return isVerbLowerCase(wholeMatch) ? suffixMapLower[suffix] : suffixMapUpper[suffix];
      }]

    ]);

    function mapToUpper(mapToLower) {
      var mapToUpper = {};
      for (prop in mapToLower) {
        mapToUpper[prop] = capitalizePhrase(mapToLower[prop]);
      }
      return mapToUpper;
    }

    function isVerbLowerCase(str) {
      return str.indexOf(rootVerb) !== -1;
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
      // string can begin with hyphen, e.g. "-disrupting"
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

