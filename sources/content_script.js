// Copyright (c) 2014 Richard Harrington.
// Use of this source code is governed by the MIT license,
// found in the LICENSE file.
// (inspired by the various people who made cloud-to-butt.)

(function() {

  // -------------- BEGINNING OF SPAGHETTI CODE --------------------

  // TODO: This whole first section needs to rewritten soon. It's spaghetti code.
  // Swap out some of these brute force rules for indentifying intransitive verbs
  // for more elegant integration with the verb API. Right now we just have to get this out
  // to fix the transitive/intransitive discrepancies in production.

  var disruptToBullshipMapTemp = {
    disrupt: 'bullshit',
    disrupts: 'bullshits',
    disrupting: 'bullshitting',
    disrupted: 'bullshitted',
    Disrupt: 'Bullshit',
    Disrupts: 'Bullshits',
    Disrupting: 'Bullshitting',
    Disrupted: 'Bullshitted'
  };

  var DISRUPT_TO_BULLSHIT_RULES = {

    customRegExpPairs: [

      // end of text node
      [ /\b(disrupt(?:s|ts|ing|ed)?)([\x27\u2019]?[\x22\u201D]?\s*)?$/gi, function(_, disrupt, closingQuotesAndSpace) {
        return disruptToBullshipMapTemp[disrupt] + (closingQuotesAndSpace || '');
      }],

      // apostrophe (single quote at end, something besides a single quote at beginning)
      [ /([^\u2018\x27])(disrupt(?:s|ts|ing|ed)?)([\u2019\x27])/gi, function(_, precedingChar, disrupt, apostrophe) {
        return precedingChar + disruptToBullshipMapTemp[disrupt] + apostrophe;
      }],

      // apostrophe (single quote at end, nothing at beginning)
      [ /^(disrupt(?:s|ts|ing|ed)?)([\u2019\x27])/gi, function(_, disrupt, apostrophe) {
        return disruptToBullshipMapTemp[disrupt] + apostrophe;
      }],

      // dash, en-dash, em-dash, comma, colon, semicolon, period (preceded by optional single and/or double quote)
      [ /\b(disrupt(?:s|ts|ing|ed)?)(\s*[\x27\u2019]?[\x22\u201D]?[-\u2013\u2014,:;.])/gi, function(_, disrupt, spaceAndPunctuation) {
        return disruptToBullshipMapTemp[disrupt] + spaceAndPunctuation;
      }],

      // conjunctions and prepositions and helping verbs
      [ /\b(disrupt(?:s|ts|ing|ed)?)([\x27\u2019]?[\x22\u201D]?\s+)(after|although|and|as|because|before|both|but|either|even|if|though|for|how|however|if|in|neither|nor|now|once|only|or|provided|rather|than|since|so|than|that|though|till|unless|until|when|whenever|where|whereas|wherever|whether|while|yet|aboard|about|above|according|across|after|against|ahead|along|amid|among|apart|around|back|because|before|behind|below|beneath|beside|between|beyond|but|by|concerning|contrary|despite|down|during|except|excepting|for|from|in|inside|instead|into|like|near|of|off|on|out|outside|over|past|rather|regarding|round|since|through|throughout|till|to|together|toward|towards|under|underneath|until|unto|up|upon|versus|via|with|within|without|worth|be|am|is|are|was|were|been|being|have|has|had|could|should|would|may|might|must|shall|can|will|do|did|does|having|get|gets|got)\b/gi, function(_, disrupt, closingQuotesAndSpace, nextWord) {
        return disruptToBullshipMapTemp[disrupt] + closingQuotesAndSpace + nextWord;
      }],


      // ----------------- END OF SPAGHETTI CODE -----------------------

      // These next custom regexp pairs are to make sure we catch as many instances
      // of the conference name as possible.

      // Followed by place names, "Hardware", or "Battlefield"
      [ /Disrupt\s+(NY|SF|New\s+York|San\s+Francisco|Europe|Beijing|Hardware|Battlefield)/g,
              'Bullshitpalooza $1' ],
      // Preceded by "TechCrunch", or any preposition
      [ /\b(TechCrunch|[Aa]bout|[Oo]f|[Aa]fter|[Aa]round|[Aa]t|[Bb]efore|[Dd]uring|[Ff]ollowing|[Ff]or|[Ii]n|[Ii]nside|[Ll]ike|[Oo]n|[Oo]utside|[Rr]egarding|[Ss]ince|[Tt]oward|[Tt]owards|[Uu]nlike|[Uu]ntil|[Vv]ia|[Ww]ith|[Ww]ithin|[Ww]ithout)\s+Disrupt\b/g,
              '$1 Bullshitpalooza' ]
    ],

    rootVerb: 'disrupt',
    helpingVerbs: ['being', 'been', 'be', 'is', 'are', 'was', 'were', 'gets', 'get', 'got', 'gotten'],
    pastParticipleMapToLowerCase: { 'disrupted': 'covered in bullshit' },

    exactPhraseMapToLowerCase: {
      'disruption of': 'bullshitting of',
      'so disruptive': 'such bullshit',
      '-disrupting': '-bullshitting'
    },

    suffixMapToLowerCase: {
      ed: 'rained bullshit on',
      ively: 'bullshittingly',
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

