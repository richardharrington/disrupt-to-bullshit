window.createVerbConverter = function(rules) {
  var customRegExpPairs = rules.customRegExpPairs;
  var prePassCustomReplacements = rules.prePassCustomReplacements;
  var midPassCustomReplacements = rules.midPassCustomReplacements;
  var rootVerb = rules.rootVerb;
  var rootConversion = rules.rootConversion;
  var helpingVerbs = rules.helpingVerbs;

  var pastParticipleMap = createLowerAndUpperMap(rules.pastParticipleMapToLowerCase);
  var customWithSmartCasingMap = createLowerAndUpperMap(rules.customMapToLowerCase);
  var suffixMap = createLowerAndUpperMap(rules.suffixMapToLowerCase);

  var pastParticiple = Object.keys(rules.pastParticipleMapToLowerCase)[0];
  var customWithSmartCasingKeys = Object.keys(rules.customMapToLowerCase);
  var suffixKeys = Object.keys(rules.suffixMapToLowerCase);

  var customWithSmartCasingRegExp =
          new RegExp("\\b" + altMatches(customWithSmartCasingKeys) + "\\b", "gi");

  // e.g. "<helping verb> <optional adverb> disrupted"
  var pastParticiplePhraseRegExp =
          new RegExp("\\b(" + altMatches(helpingVerbs) + ")\\s+(?:(\\w+)\\s+)?" + pastParticiple + "\\b", "gi");

  var verbWithSuffixRegExp =
          new RegExp("\\b" + rootVerb + "(" + altMatches(suffixKeys) + ")?\\b", "gi");

  // in case there's something we missed in the middle of a word,
  // just convert it to the root verb.
  var fallbackRegExp = new RegExp(rootVerb, "gi");

  var pastParticipleReplacement = [
    pastParticiplePhraseRegExp, function(wholeMatch, helpingVerb, adverb) {
      var pastParticipleReplacement = withCorrectCase(pastParticipleMap, pastParticiple, wholeMatch);
      var maybeAdverbAndSpace = adverb ? adverb + ' ' : '';
      return helpingVerb + ' ' + maybeAdverbAndSpace + pastParticipleReplacement;
    }
  ];

  var customWithSmartCasingReplacement = [
    customWithSmartCasingRegExp, function(wholeMatch) {
      return withCorrectCase(customWithSmartCasingMap, wholeMatch.toLowerCase(), wholeMatch);
    }
  ];

  var verbWithSuffixReplacement = [
    verbWithSuffixRegExp, function(wholeMatch, suffix) {
      return withCorrectCase(suffixMap, (suffix || ''), wholeMatch);
    }
  ];

  var fallbackReplacement = [
    fallbackRegExp, function(wholeMatch) {
      return isVerbLowerCase(wholeMatch) ? rootConversion : capitalizePhrase(rootConversion);
    }
  ];

  var conversions = [].concat(
    prePassCustomReplacements,
    [pastParticipleReplacement, customWithSmartCasingReplacement],
    midPassCustomReplacements,
    [verbWithSuffixReplacement, fallbackReplacement]
  );

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

  return convert;
};