window.DISRUPT_TO_BULLSHIT_RULES = (function() {

  // These special cases are good-enough brute force rules for identifying
  // intransitive verbs, with as few false negatives and false positives
  // as possible.

  var specialCases = (function() {

    var mapToBullshit = {
      disrupt: 'bullshit',
      disrupts: 'bullshits',
      disrupting: 'bullshitting',
      disrupted: 'bullshitted',
      Disrupt: 'Bullshit',
      Disrupts: 'Bullshits',
      Disrupting: 'Bullshitting',
      Disrupted: 'Bullshitted'
    };

    return [

      // end of text node
      [ /\b(disrupt(?:s|ts|ing|ed)?)([\x27\u2019]?[\x22\u201D]?\s*)?$/gi, function(_, disrupt, closingQuotesAndSpace) {
        return mapToBullshit[disrupt] + (closingQuotesAndSpace || '');
      }],

      // apostrophe (single quote at end, something besides a single quote at beginning)
      [ /([^\u2018\x27])(disrupt(?:s|ts|ing|ed)?)([\u2019\x27])/gi, function(_, precedingChar, disrupt, apostrophe) {
        return precedingChar + mapToBullshit[disrupt] + apostrophe;
      }],

      // apostrophe (single quote at end, nothing at beginning)
      [ /^(disrupt(?:s|ts|ing|ed)?)([\u2019\x27])/gi, function(_, disrupt, apostrophe) {
        return mapToBullshit[disrupt] + apostrophe;
      }],

      // dash, en-dash, em-dash, comma, colon, semicolon, period, question mark and exclamation mark (preceded by optional single and/or double quote)
      [ /\b(disrupt(?:s|ts|ing|ed)?)(\s*[\x27\u2019]?[\x22\u201D]?[-\u2013\u2014,:;.?!])/gi, function(_, disrupt, spaceAndPunctuation) {
        return mapToBullshit[disrupt] + spaceAndPunctuation;
      }],

      // conjunctions and prepositions and helping verbs
      [ /\b(disrupt(?:s|ts|ing|ed)?)([\x27\u2019]?[\x22\u201D]?\s+)(after|although|and|as|at|because|before|both|but|either|even|if|though|for|how|however|if|in|neither|nor|now|once|only|or|provided|rather|than|since|so|than|that|though|till|unless|until|when|whenever|where|whereas|wherever|whether|while|yet|aboard|about|above|according|across|after|against|ahead|along|amid|among|apart|around|back|because|before|behind|below|beneath|beside|between|beyond|but|by|concerning|contrary|despite|down|during|except|excepting|for|from|in|inside|instead|into|like|near|of|off|on|out|outside|over|past|rather|regarding|round|since|through|throughout|till|to|together|toward|towards|under|underneath|until|unto|up|upon|versus|via|with|within|without|worth|be|am|is|are|was|were|been|being|have|has|had|could|should|would|may|might|must|shall|can|will|do|did|does|having|get|gets|got)\b/gi, function(_, disrupt, closingQuotesAndSpace, nextWord) {
        return mapToBullshit[disrupt] + closingQuotesAndSpace + nextWord;
      }]
    ];
  })();

  return {
    specialCases: specialCases,
    customRegExpPairs: [

      // These next custom regexp pairs are to make sure we catch as many instances
      // of the conference name as possible.

      // Followed by place names, "Hardware", or "Battlefield"
      [ /Disrupt\s+(NY|SF|New\s+York|San\s+Francisco|Europe|Beijing|Hardware|Battlefield)/g,
              'Bullshitpalooza $1' ],
      // Preceded by "TechCrunch", or any preposition
      [ /\b(TechCrunch|about|of|after|around|at|before|during|following|for|in|inside|like|on|outside|regarding|since|toward|towards|unlike|until|via|with|within|without)\s+Disrupt\b/g,
        function(_, precedingWord) {
          return precedingWord + ' Bullshitpalooza';
        }]

    ],

    rootVerb: 'disrupt',
    rootConversion: 'bullshit',
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
})();

