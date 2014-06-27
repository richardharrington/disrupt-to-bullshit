var SUBSTITUTIONS = (function() {

  // "<helping verb> <optional adverb> disrupted" =>
  // "<helping verb> <optional adverb> drowned in bullshit"
  var specialSubstitutions = [
    [ /(be|being|been|is|are|were|get|gets)\s+(\w+\s+)?disrupted/g, '$1 $2 drowned in bullshit'],
    [ /(Be|Being|Been|Is|Are|Were|Get|Gets)\s+(\w+\s+)?Disrupted/g, '$1 $2 Drowned In Bullshit']
  ];

  var lowerCasePhrasePairs = [
    [ 'so disruptive', 'such bullshit' ],
    [ 'disrupted', 'rained bullshit on' ],
    [ 'disruptive', 'bullshit' ],
    [ 'disruptions', 'piles of bullshit' ],
    [ 'disruption', 'bullshit' ],
    [ '-disrupting', '-bullshitting' ],
    [ 'disrupting', 'raining bullshit on' ],
    [ 'disruptor', 'bullshitter' ],
    [ 'disrupts', 'rains bullshit on' ],
    [ 'disrupt', 'rain bullshit on' ],
  ];

  var substitutions = generateSubstitutions();

  // In the generateSubstitutions function, the information will be compiled in the order listed above.

  function generateSubstitutions() {
    var upperCasePhrasePairs = lowerCasePhrasePairs.map(capitalizePhrases);
    var phrasePairs = [].concat(lowerCasePhrasePairs, upperCasePhrasePairs);
    var regularSubstitutions = phrasePairs.map(generateSubstitution);

    return [].concat(specialSubstitutions, regularSubstitutions);
  }

  function capitalizePhrases(phrases) {
    return phrases.map(function(phrase) {
      return phrase.split(" ").map(capitalizeWord).join(" ");
    });
  }

  function capitalizeWord(word) {
    // A word may start with a hyphen
    var firstLetterIdx = (word[0] === '-') ? 1 : 0;
    var firstLetter = word[firstLetterIdx];
    return word.substr(0, firstLetterIdx) + capitalizeLetter(firstLetter) + word.substr(firstLetterIdx + 1);
  }

  function capitalizeLetter(letter) {
    return String.fromCharCode(letter.charCodeAt(0) - 32);
  }

  function generateSubstitution(pair) {
    var regExp = new RegExp(pair[0], "g");
    var replacement = pair[1];
    return [regExp, replacement];
  }

  return {
    disruptToBullshit: function(originalText) {
      return substitutions.reduce(function(text, substitution) {
        var regExp = substitution[0];
        var replacement = substitution[1];
        return text.replace(regExp, replacement);
      }, originalText);
    }
  };
}());

var INNOVATION_WORDS = /entrepreneur|regulation|tech|technology|silicon|industry|industries|startup|innovative|innovation|computing|computer|data|storage|server|provider|app[\W]|apps|hardware|software/i;

var MAX_INNOVATION_SMELL_RATIO = 0.005; // More than 0.5% of nodes must contain at least
                                        // one innovation-related word


// ---------------------------------------------

makeItSo();

// ---------------------------------------------

function makeItSo() {
  var innovationSmellRatio = nodeRatio(document.body, isInnovationRelated);
  if (innovationSmellRatio > MAX_INNOVATION_SMELL_RATIO)
    walk(document.body, convertIntoBullshit);
}

function nodeRatio(root, predicate) {
  var counts = nodeCounts(root, predicate);
  return counts.whenPredicateTrue / counts.allNodes;
}

function nodeCounts(root, predicate) {
  var allNodesCounter = 0;
  var whenPredicateTrueCounter = 0;
  walk(root, function(node) {
    allNodesCounter++;
    if (predicate(node))
      whenPredicateTrueCounter++;
  });
  return {
    allNodes: allNodesCounter,
    whenPredicateTrue: whenPredicateTrueCounter
  };
}

function walk(root, callback) {

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

function isInnovationRelated(node) {
  var text = node.nodeValue;
  return text.match(INNOVATION_WORDS);
}

function convertIntoBullshit(node) {
  node.nodeValue = SUBSTITUTIONS.disruptToBullshit(node.nodeValue);
}
