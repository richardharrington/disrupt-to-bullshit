(function() {

  var DISRUPTION_SUBSTITUTIONS = (function() {

    var endingMap = {
      ed: 'rained bullshit on',
      ively: 'by means of bullshit',
      ive: 'bullshit',
      ions: 'piles of bullshit',
      ion: 'bullshit',
      ing: 'raining bullshit on',
      or: 'bullshitter',
      s: 'rains bullshit on',
      '': 'rain bullshit on'
    };

    var substitutions = [

      // "<helping verb> <optional adverb> disrupted" =>
      // "<helping verb> <optional adverb> covered in bullshit"
      [ /(be|being|been|is|are|were|get|gets)\s+(\w+\s+)?disrupted/g, '$1 $2 covered in bullshit' ],
      [ /(Be|Being|Been|Is|Are|Were|Get|Gets)\s+(\w+\s+)?Disrupted/g, '$1 $2 Covered in Bullshit' ],

      [ /so disruptive/g, 'such bullshit' ],
      [ /So Disruptive/g, 'Such Bullshit' ],
      [ /so disruptively/g, 'by means of such bullshit' ],
      [ /So Disruptively/g, 'By Means Of Such Bullshit' ],
      [ /-disrupting/g, '-bullshitting' ],
      [ /-Disrupting/g, '-Bullshitting' ],
      [ /\b([Dd])isrupt(ed|ively|ive|ions|ion|ing|or|s)?\b/g, function(_, firstLetter, ending) {
          var isUpperCase = firstLetter === 'D';
          var phrase = endingMap[ending || ''];
          return isUpperCase ? capitalizePhrase(phrase) : phrase;
      }]
    ];

    function capitalizePhrase(phrase) {
      return phrase.split(' ').map(function(word) {
        return (word.length > 2) ? capitalizeWord(word) : word;
      }).join(' ');
    }

    function capitalizeWord(word) {
      var firstLetterCode = word.charCodeAt(0);
      var capitalizedFirstLetter = String.fromCharCode(firstLetterCode - 32);
      return capitalizedFirstLetter + word.substr(1);
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
    recurOnNode(root);

    function recurOnNode(node) {
      switch (node.nodeType) {
        case 1:
        case 9:
        case 11:
          walkChildren(node);
          break;
        case 3:
          handleTextNode(node);
      }
    }

    function walkChildren(node) {
      var next;
      var child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        recurOnNode(child);
        child = next;
      }
    }

    function handleTextNode(node) {
      if (node.parentElement.tagName.toLowerCase() !== "script")
        callback(node);
    }
  }

})();

