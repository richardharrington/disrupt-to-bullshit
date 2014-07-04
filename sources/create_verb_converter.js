window.createVerbConverter = function(rules) {
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
};