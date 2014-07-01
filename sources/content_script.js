// Copyright (c) 2014 Richard Harrington.
// Use of this source code is governed by the MIT license,
// found in the LICENSE file.
// (inspired by the various people who made cloud-to-butt.)

(function() {

  var DISRUPT_TO_BULLSHIT_RULES = {

    // These custom regexp pairs are to make sure we catch as many instances
    // of the conference name as possible.
    customRegExpPairs: [
      // Followed by place names, "Hardware", or "Battlefield"
      [ /Disrupt\s+(NY|SF|New\s+York|San\s+Francisco|Europe|Beijing|Hardware|Battlefield)/g,
              'Bullshitpalooza $1' ],
      // Preceded by "TechCrunch", or any preposition
      [ /\b(TechCrunch|[Aa]bout|[Oo]f|[Aa]fter|[Aa]round|[Aa]t|[Bb]efore|[Dd]uring|[Ff]ollowing|[Ff]or|[Ii]n|[Ii]nside|[Ll]ike|[Oo]n|[Oo]utside|[Rr]egarding|[Ss]ince|[Tt]oward|[Tt]owards|[Uu]nlike|[Uu]ntil|[Vv]ia|[Ww]ith|[Ww]ithin|[Ww]ithout)\s+Disrupt\b/g,
              '$1 Bullshitpalooza' ]
    ],

    rootVerb: 'disrupt',
    helpingVerbs: ['being', 'been', 'be', 'is', 'are', 'was', 'were', 'gets', 'get'],
    pastParticipleMapToLowerCase: { 'disrupted': 'covered in bullshit' },

    exactPhraseMapToLowerCase: {
      'so disruptive': 'such bullshit',
      'so disruptively': 'by means of such bullshit',
      '-disrupting': '-bullshitting'
    },

    suffixMapToLowerCase: {
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
      s: 'rains bullshit on',
      '': 'rain bullshit on'
    }

  };

  // ---------------------------------------------

  makeItSo();

  function makeItSo() {
    var disruptToBullshit = createVerbConverter(DISRUPT_TO_BULLSHIT_RULES);
    walkTextNodes(document.body, function(node) {
      node.nodeValue = disruptToBullshit(node.nodeValue);
    });
  }

  // ---------------------------------------------

  function walkTextNodes(root, callback) {
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

  function createVerbConverter(rules) {
    var customRegExpPairs = rules.customRegExpPairs;
    var rootVerb = rules.rootVerb;
    var helpingVerbs = rules.helpingVerbs;

    var pastParticipleMap = createLowerAndUpperMap(rules.pastParticipleMapToLowerCase);
    var exactPhraseMap = createLowerAndUpperMap(rules.exactPhraseMapToLowerCase);
    var suffixMap = createLowerAndUpperMap(rules.suffixMapToLowerCase);

    var pastParticiple = Object.keys(rules.pastParticipleMapToLowerCase)[0];
    var exactPhraseKeys = Object.keys(rules.exactPhraseMapToLowerCase);
    var suffixKeys = Object.keys(rules.suffixMapToLowerCase);

    // e.g. "<helping verb> <optional adverb> disrupted"
    var pastParticiplePhraseRegExp =
            new RegExp("\\b(" + altMatches(helpingVerbs) + ")\\s+(\\w+\\s+)?" + pastParticiple + "\\b", "gi");

    var exactPhraseRegExp =
            new RegExp("\\b" + altMatches(exactPhraseKeys) + "\\b", "gi");

    var verbWithSuffixRegExp =
            new RegExp("\\b" + rootVerb + "(" + altMatches(suffixKeys) + ")?\\b", "gi");

    var conversions = customRegExpPairs.concat([

      [ pastParticiplePhraseRegExp, function(wholeMatch, helpingVerb, adverb) {
          var pastParticipleReplacement = withCorrectCase(pastParticipleMap, pastParticiple, wholeMatch);
          return helpingVerb + ' ' + (adverb || '') + ' ' + pastParticipleReplacement;
      }],

      [ exactPhraseRegExp, function(wholeMatch) {
          return withCorrectCase(exactPhraseMap, wholeMatch.toLowerCase(), wholeMatch);
      }],

      [ verbWithSuffixRegExp, function(wholeMatch, suffix) {
          return withCorrectCase(suffixMap, (suffix || ''), wholeMatch);
      }]

    ]);

    return convert;

    function convert(originalText) {
      return conversions.reduce(function(text, conversion) {
        return text.replace(conversion[0], conversion[1]);
      }, originalText);
    }

    function createLowerAndUpperMap(mapToLower) {
      var mapToUpper = {};
      for (prop in mapToLower)
        mapToUpper[prop] = capitalizePhrase(mapToLower[prop]);

      return {lower: mapToLower, upper: mapToUpper};
    }

    function withCorrectCase(map, key, referencePhrase) {
      return isVerbLowerCase(referencePhrase) ? map.lower[key] : map.upper[key];
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
  }
})();

