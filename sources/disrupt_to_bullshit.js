window.DISRUPT_TO_BULLSHIT_RULES = {

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
