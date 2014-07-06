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

    assert('disrupt to rain bullshit on',
           'disrupt this place', 'rain bullshit on this place');

    assert('disrupted to rained bullshit on',
           'disrupted this place', 'rained bullshit on this place');

    assert('disrupts to rains bullshit on',
           'disrupts this place', 'rains bullshit on this place');

    assert('disrupting to raining bullshit on',
           'disrupting this place', 'raining bullshit on this place');

    assert('Disrupt to Rain Bullshit on',
           'Disrupt this place', 'Rain Bullshit on this place');

    assert('Disrupted to Rained Bullshit on',
           'Disrupted this place', 'Rained Bullshit on this place');

    assert('Disrupts to Rains Bullshit on',
           'Disrupts this place', 'Rains Bullshit on this place');

    assert('Disrupting to Raining Bullshit on',
           'Disrupting this place', 'Raining Bullshit on this place');

    assert('disrupt to rain bullshit on when surrounded by single straight quotes',
           '\'disrupt\' this', '\'rain bullshit on\' this');

    assert('disrupt to rain bullshit on when surrounded by single curly quotes',
           '‘disrupt’ this', '‘rain bullshit on’ this');

    assert('disrupt to rain bullshit on when surrounded by double straight quotes',
           '"disrupt" this', '"rain bullshit on" this');

    assert('disrupt to rain bullshit on when surrounded by double curly quotes',
           '“disrupt” this', '“rain bullshit on” this');

    assert('disrupt to rain bullshit on when surrounded by single and double quotes',
           '“‘disrupt’” this', '“‘rain bullshit on’” this');

  });

  describe("noun", function() {

    assert('disruption to bullshit',
           'disruption', 'bullshit');

    assert('disruptions to piles of bullshit',
           'disruptions', 'piles of bullshit');

    assert('disruptor to bullshitter',
           'disruptor', 'bullshitter');

    assert('disrupter to bullshitter',
           'disrupter', 'bullshitter');

    assert('disruptors to bullshitters',
           'disruptors', 'bullshitters');

    assert('disrupters to bullshitters',
           'disrupters', 'bullshitters');

    assert('Disruption to Bullshit',
           'Disruption', 'Bullshit');

    assert('Disruptions to Piles of Bullshit',
           'Disruptions', 'Piles of Bullshit');

    assert('Disruptor to Bullshitter',
           'Disruptor', 'Bullshitter');

    assert('Disrupter to Bullshitter',
           'Disrupter', 'Bullshitter');

    assert('Disruptors to Bullshitters',
           'Disruptors', 'Bullshitters');

    assert('Disrupters to Bullshitters',
           'Disrupters', 'Bullshitters');

  });

  describe("adjective and adverb", function() {

    assert('disruptive to bullshit',
           'disruptive', 'bullshit');

    assert('Disruptive to Bullshit',
           'Disruptive', 'Bullshit');

    assert('disruptively to bullshittingly',
           'disruptively', 'bullshittingly');

    assert('Disruptively to Bullshittingly',
           'Disruptively', 'Bullshittingly');

  });

  describe("past participle in passive construction", function() {

    assert('<LC helping verb> disrupted to <LC helping verb>covered in bullshit',
           'got disrupted', 'got covered in bullshit');

    assert('<LC helping verb> <LC adverb> totally disrupted to <LC helping verb> <LC adverb> totally covered in bullshit',
           'got totally disrupted', 'got totally covered in bullshit');

    assert('<UC helping verb> Disrupted to <UC helping verb> Covered in Bullshit',
           'Got Disrupted', 'Got Covered in Bullshit');

    assert('<LC helping verb> Disrupted to <LC helping verb> Covered in Bullshit',
           'got Disrupted', 'got Covered in Bullshit');

    assert('<LC helping verb> <UC adverb> Disrupted to <LC helping verb> <UC adverb> Covered in Bullshit',
           'got Totally Disrupted', 'got Totally Covered in Bullshit');

    assert('tightens up extra spaces',
           'got    totally          disrupted', 'got totally covered in bullshit');

  });

  describe("looks like transitive verb but is probably intransitive verb or noun", function() {

    assert('disrupt to bullshit at end of string',
           'disrupt', 'bullshit');

    assert('disrupting to bullshitting when at end of string',
           'disrupting', 'bullshitting');

    assert('disrupted to bullshitted when at end of string',
           'disrupting', 'bullshitting');

    assert('disrupts to bullshits when at end of string',
           'disrupting', 'bullshitting');

    assert('Disrupt to Bullshit at end of string',
           'Disrupt', 'Bullshit');

    assert('Disrupting to Bullshitting when at end of string',
           'Disrupting', 'Bullshitting');

    assert('Disrupted to Bullshitted when at end of string',
           'Disrupting', 'Bullshitting');

    assert('Disrupts to Bullshits when at end of string',
           'Disrupting', 'Bullshitting');

    assert('disrupt to bullshit when at end of string surrounded by single straight quotes',
           '\'disrupt\'', '\'bullshit\'');

    assert('disrupt to bullshit when at end of string surrounded by double straight quotes',
           '"disrupt"', '"bullshit"');

    assert('disrupt to bullshit when at end of string surrounded by single curly quotes',
           '‘disrupt’', '‘bullshit’');

    assert('disrupt to bullshit when at end of string surrounded by double curly quotes',
           '“disrupt”', '“bullshit”');

    assert('disrupt to bullshit when at end of string surrounded by single and double quotes',
           '“‘disrupt’”', '“‘bullshit’”');

    assert('disrupt to bullshit when followed by comma',
           'disrupt,', 'bullshit,');

    assert('disrupt to bullshit when followed by dash',
           'disrupt-', 'bullshit-');

    assert('disrupt to bullshit when followed by en-dash',
           'disrupt–', 'bullshit–');

    assert('disrupt to bullshit when followed by em-dash',
           'disrupt—', 'bullshit—');

    assert('disrupt to bullshit when followed by colon',
           'disrupt:', 'bullshit:');

    assert('disrupt to bullshit when followed by semicolon',
           'disrupt;', 'bullshit;');

    assert('disrupt to bullshit when followed by period',
           'disrupt.', 'bullshit.');

    assert('disrupt to bullshit when followed by question mark',
           'disrupt?', 'bullshit?');

    assert('disrupt to bullshit when followed by exclamation point',
           'disrupt!', 'bullshit!');

    assert('deals with optional multiple spaces before punctuation',
           'disrupt     :', 'bullshit     :');

    assert('disrupt to bullshit when followed by single straight quote and preceded by something other than single straight quote',
           'It is not disrupt\'s fault', 'It is not bullshit\'s fault');

    assert('disrupt to bullshit when followed by single straight quote and preceded by something other than single straight quote',
           'It is not disrupt’s fault', 'It is not bullshit’s fault');

    assert('disrupt to bullshit when starting the string and followed by single straight quote',
           'disrupt\'', 'bullshit\'');

    assert('disrupt to bullshit when starting the string and followed by single curly quote',
           'disrupt’', 'bullshit’');

    assert('disrupt to bullshit when starting the string and followed by single curly quote',
           'disrupt’', 'bullshit’');

    assert('disrupt to bullshit when other punctuation follows quote',
           '"disrupt":', '"bullshit":');

    assert('disrupt to bullshit when followed by preposition, conjunction, or verb',
           'disrupt until', 'bullshit until');

  });

  describe("phrases related to the conference", function() {

    assert('Disrupt <place name> to Bullshitpalooza <place name>',
           'Disrupt NY', 'Bullshitpalooza NY');

    assert('Disrupt Hardware to Bullshitpalooza Hardware',
           'Disrupt Hardware', 'Bullshitpalooza Hardware');

    assert('Disrupt Battlefield to Bullshitpalooza Battlefield',
           'Disrupt Battlefield', 'Bullshitpalooza Battlefield');

    assert('TechCrunch Disrupt to TechCrunch Bullshitpalooza',
           'going to TechCrunch Disrupt now', 'going to TechCrunch Bullshitpalooza now');

    assert('is not the conference name if it is lowercase',
           'going to disrupt New York now', 'going to rain bullshit on New York now');

  });

  describe("special phrases", function() {

    assert('disruption of to bullshitting of',
           'disruption of', 'bullshitting of');
    
    assert('so disruptive to such bullshit',
           'so disruptive', 'such bullshit');
    
    assert('-disrupting to -bullshitting',
           'industry-disrupting factors', 'industry-bullshitting factors');
    
    assert('Disruption of to Bullshitting of',
           'Disruption of', 'Bullshitting of');
    
    assert('So Disruptive to Such Bullshit',
           'So Disruptive', 'Such Bullshit');
    
    assert('so Disruptive to Such Bullshit',
           'so Disruptive', 'Such Bullshit');
    
    assert('-Disrupting to -Bullshitting',
           'Industry-Disrupting Factors', 'Industry-Bullshitting Factors');
    
  });


  describe("fallback case for things this code hasn't dealt with", function() {

    assert('disrupt to bullshit when preceded by random letters',
           'randomlettersdisrupt', 'randomlettersbullshit');

    assert('disrupt to bullshit when followed by random letters',
           'disruptrandomletters', 'bullshitrandomletters');

    assert('Disrupt to Bullshit when preceded by random letters',
           'randomlettersDisrupt', 'randomlettersBullshit');

    assert('Disrupt to Bullshit when followed by random letters',
           'Disruptrandomletters', 'Bullshitrandomletters');

  });

});
