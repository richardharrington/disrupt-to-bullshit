// TODO: regularize the treatment of multiple or odd whitespace characters.
// Currently some conversions preserve them; others turn them into one space.

// Also add more rules for the conference: all lower case should be the conference
// (disrupt ny) and also put in rules for trying to check if almost all words in the node
// is lower-case except Disrupt, in which case it's probably the conference.

describe("createVerbConverter", function() {
  var convert = window.createVerbConverter(window.DISRUPT_TO_BULLSHIT_RULES);

  function assert(description, formOfDisrupt, formOfBullshit) {
    it(description, function() {
      expect(convert(formOfDisrupt)).toEqual(formOfBullshit);
    });
  }

  describe("transitive verb", function() {

    assert('disrupt => rain bullshit on',
           'disrupt this place', 'rain bullshit on this place');

    assert('disrupted => rained bullshit on',
           'disrupted this place', 'rained bullshit on this place');

    assert('disrupts => rains bullshit on',
           'disrupts this place', 'rains bullshit on this place');

    assert('disrupting => raining bullshit on',
           'disrupting this place', 'raining bullshit on this place');

    assert('Disrupt => Rain Bullshit on',
           'Disrupt this place', 'Rain Bullshit on this place');

    assert('Disrupted => Rained Bullshit on',
           'Disrupted this place', 'Rained Bullshit on this place');

    assert('Disrupts => Rains Bullshit on',
           'Disrupts this place', 'Rains Bullshit on this place');

    assert('Disrupting => Raining Bullshit on',
           'Disrupting this place', 'Raining Bullshit on this place');

    assert('disrupt => rain bullshit on when surrounded by single straight quotes',
           '\'disrupt\' this', '\'rain bullshit on\' this');

    assert('disrupt => rain bullshit on when surrounded by single curly quotes',
           '‘disrupt’ this', '‘rain bullshit on’ this');

    assert('disrupt => rain bullshit on when surrounded by double straight quotes',
           '"disrupt" this', '"rain bullshit on" this');

    assert('disrupt => rain bullshit on when surrounded by double curly quotes',
           '“disrupt” this', '“rain bullshit on” this');

    assert('disrupt => rain bullshit on when surrounded by single and double straight quotes',
           '"\'disrupt\'" this', '"\'rain bullshit on\'" this');

    assert('disrupt => rain bullshit on when surrounded by single and double curly quotes',
           '“‘disrupt’” this', '“‘rain bullshit on’” this');

  });

  describe("noun", function() {

    assert('disruption => bullshit',
           'disruption', 'bullshit');

    assert('disruptions => piles of bullshit',
           'disruptions', 'piles of bullshit');

    assert('disruptor => bullshitter',
           'disruptor', 'bullshitter');

    assert('disrupter => bullshitter',
           'disrupter', 'bullshitter');

    assert('disruptors => bullshitters',
           'disruptors', 'bullshitters');

    assert('disrupters => bullshitters',
           'disrupters', 'bullshitters');

    assert('Disruption => Bullshit',
           'Disruption', 'Bullshit');

    assert('Disruptions => Piles of Bullshit',
           'Disruptions', 'Piles of Bullshit');

    assert('Disruptor => Bullshitter',
           'Disruptor', 'Bullshitter');

    assert('Disrupter => Bullshitter',
           'Disrupter', 'Bullshitter');

    assert('Disruptors => Bullshitters',
           'Disruptors', 'Bullshitters');

    assert('Disrupters => Bullshitters',
           'Disrupters', 'Bullshitters');

  });

  describe("adjective and adverb", function() {

    assert('disruptive => bullshit',
           'disruptive', 'bullshit');

    assert('Disruptive => Bullshit',
           'Disruptive', 'Bullshit');

    assert('disruptively => bullshittingly',
           'disruptively', 'bullshittingly');

    assert('Disruptively => Bullshittingly',
           'Disruptively', 'Bullshittingly');

  });

  describe("past participle in passive construction", function() {

    assert('<helping verb> disrupted => <helping verb>covered in bullshit',
           'got disrupted', 'got covered in bullshit');

    assert('<helping verb> <adverb> disrupted => <helping verb> <adverb> covered in bullshit',
           'got totally disrupted', 'got totally covered in bullshit');

    assert('<Helping Verb> Disrupted => <Helping Verb> Covered in Bullshit',
           'Got Disrupted', 'Got Covered in Bullshit');

    assert('<helping verb> Disrupted => <helping verb> Covered in Bullshit',
           'got Disrupted', 'got Covered in Bullshit');

    assert('<helping verb> <Adverb> Disrupted => <helping verb> <Adverb> Covered in Bullshit',
           'got Totally Disrupted', 'got Totally Covered in Bullshit');

    assert('tightens up extra spaces',
           'got    totally          disrupted', 'got totally covered in bullshit');

  });

  describe("looks like transitive verb but is probably intransitive verb or noun", function() {

    assert('disrupt => bullshit at end of string',
           'disrupt', 'bullshit');

    assert('disrupting => bullshitting when at end of string',
           'disrupting', 'bullshitting');

    assert('disrupted => bullshitted when at end of string',
           'disrupting', 'bullshitting');

    assert('disrupts => bullshits when at end of string',
           'disrupting', 'bullshitting');

    assert('Disrupt => Bullshit at end of string',
           'Disrupt', 'Bullshit');

    assert('Disrupting => Bullshitting when at end of string',
           'Disrupting', 'Bullshitting');

    assert('Disrupted => Bullshitted when at end of string',
           'Disrupting', 'Bullshitting');

    assert('Disrupts => Bullshits when at end of string',
           'Disrupting', 'Bullshitting');

    assert('disrupt => bullshit when at end of string surrounded by single straight quotes',
           '\'disrupt\'', '\'bullshit\'');

    assert('disrupt => bullshit when at end of string surrounded by double straight quotes',
           '"disrupt"', '"bullshit"');

    assert('disrupt => bullshit when at end of string surrounded by single curly quotes',
           '‘disrupt’', '‘bullshit’');

    assert('disrupt => bullshit when at end of string surrounded by double curly quotes',
           '“disrupt”', '“bullshit”');

    assert('disrupt => bullshit when at end of string surrounded by single and double straight quotes',
           '"\'disrupt\'"', '"\'bullshit\'"');

    assert('disrupt => bullshit when at end of string surrounded by single and double curly quotes',
           '“‘disrupt’”', '“‘bullshit’”');

    assert('disrupt => bullshit when followed by comma',
           'disrupt,', 'bullshit,');

    assert('disrupt => bullshit when followed by dash',
           'disrupt-', 'bullshit-');

    assert('disrupt => bullshit when followed by en-dash',
           'disrupt–', 'bullshit–');

    assert('disrupt => bullshit when followed by em-dash',
           'disrupt—', 'bullshit—');

    assert('disrupt => bullshit when followed by colon',
           'disrupt:', 'bullshit:');

    assert('disrupt => bullshit when followed by semicolon',
           'disrupt;', 'bullshit;');

    assert('disrupt => bullshit when followed by period',
           'disrupt.', 'bullshit.');

    assert('disrupt => bullshit when followed by question mark',
           'disrupt?', 'bullshit?');

    assert('disrupt => bullshit when followed by exclamation point',
           'disrupt!', 'bullshit!');

    assert('deals with optional multiple spaces before punctuation',
           'disrupt     :', 'bullshit     :');

    assert('disrupt => bullshit when followed by single straight quote and preceded by something other than single straight quote',
           'It is not disrupt\'s fault', 'It is not bullshit\'s fault');

    assert('disrupt => bullshit when followed by single curly quote and preceded by something other than single curly quote',
           'It is not disrupt’s fault', 'It is not bullshit’s fault');

    assert('disrupt => bullshit when starting the string and followed by single straight quote',
           'disrupt\'', 'bullshit\'');

    assert('disrupt => bullshit when starting the string and followed by single curly quote',
           'disrupt’', 'bullshit’');

    assert('disrupt => bullshit when other punctuation follows quote',
           '"disrupt":', '"bullshit":');

    assert('disrupt => bullshit when followed by preposition, conjunction, or verb',
           'disrupt until', 'bullshit until');

  });

  describe("phrases related to the conference", function() {

    assert('Disrupt <Place Name> => Bullshitpalooza <Place Name>',
           'Disrupt NY', 'Bullshitpalooza NY');

    assert('Disrupt Hardware => Bullshitpalooza Hardware',
           'Disrupt Hardware', 'Bullshitpalooza Hardware');

    assert('Disrupt Battlefield => Bullshitpalooza Battlefield',
           'Disrupt Battlefield', 'Bullshitpalooza Battlefield');

    assert('TechCrunch Disrupt => TechCrunch Bullshitpalooza',
           'going to TechCrunch Disrupt now', 'going to TechCrunch Bullshitpalooza now');

    assert('is not the conference name if it is lowercase',
           'going to disrupt New York now', 'going to rain bullshit on New York now');

  });

  describe("special phrases", function() {

    assert('disruption of => bullshitting of',
           'disruption of', 'bullshitting of');
    
    assert('so disruptive => such bullshit',
           'so disruptive', 'such bullshit');
    
    assert('-disrupting => -bullshitting',
           'industry-disrupting factors', 'industry-bullshitting factors');
    
    assert('Disruption of => Bullshitting of',
           'Disruption of', 'Bullshitting of');
    
    assert('So Disruptive => Such Bullshit',
           'So Disruptive', 'Such Bullshit');
    
    assert('so Disruptive => Such Bullshit',
           'so Disruptive', 'Such Bullshit');
    
    assert('-Disrupting => -Bullshitting',
           'Industry-Disrupting Factors', 'Industry-Bullshitting Factors');
    
  });


  describe("fallback case for things this code hasn't dealt with", function() {

    assert('disrupt => bullshit when preceded by random letters',
           'randomlettersdisrupt', 'randomlettersbullshit');

    assert('disrupt => bullshit when followed by random letters',
           'disruptrandomletters', 'bullshitrandomletters');

    assert('Disrupt => Bullshit when preceded by random letters',
           'randomlettersDisrupt', 'randomlettersBullshit');

    assert('Disrupt => Bullshit when followed by random letters',
           'Disruptrandomletters', 'Bullshitrandomletters');

  });

});
