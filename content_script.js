// In the generateSubstitutions function, the information will be compiled in the order listed below.

var innovationWords = /entrepreneur|regulation|tech|technology|silicon|industry|industries|startup|innovative|innovation|computing|computer|data|storage|server|provider|app[\W]|apps|hardware|software/i;

var specialSubstitutions = [
    [ /Disrupt\s+NY/g, 'Rain Bullshit On NY' ],
    [ /Disrupt\s+SF/g, 'Rain Bullshit On SF' ],
    [ /Disrupt\s+New York/g, 'Rain Bullshit On New York' ],
    [ /Disrupt\s+San Francisco/g, 'Rain Bullshit On San Francisco' ],
    [ /Disrupt\s+Europe/g, 'Rain Bullshit On Europe' ],
    [ /Disrupt\s+Beijing/g, 'Rain Bullshit On Beijing' ],
    [ /TechCrunch\s+Disrupt/g, 'TechCrunch Rain Bullshit' ],
    // any capitalized Disrupt preceded by a lower-case word is probably the TechCrunch conference
    [ /(\s+[a-z]+\s)+Disrupt/g, function(_, precedingWord) { return precedingWord + 'Rain Bullshit'; } ]
];

var lowerCaseHelpingVerbs = ['being', 'be', 'were', 'are', 'been', 'get', 'gets'];
var lowerCasePastParticiple = 'disrupted';
var lowerCasePastParticipleReplacement = 'drowned in bullshit';

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

// ---------------------------------------------

var maxInnovationSmellRatio = 0.005; // More than 0.5% of nodes must contain at least one innovation-related word

var substitutions = generateSubstitutions();

var innovationSmellRatio = nodeRatio(document.body, isInnovationRelated);
if (innovationSmellRatio > maxInnovationSmellRatio)
    walk(document.body, convertIntoBullshit);

// ---------------------------------------------


function generateSubstitutions() {
    var upperCasePhrasePairs = lowerCasePhrasePairs.map(capitalizePhrases);
    var upperCaseHelpingVerbs = lowerCaseHelpingVerbs.map(capitalizePhrase);

    var phrasePairs = [].concat(lowerCasePhrasePairs, upperCasePhrasePairs);
    var helpingVerbs = [].concat(lowerCaseHelpingVerbs, upperCaseHelpingVerbs);

    return [].concat(
        specialSubstitutions,
        helpingVerbs.map(generatePastParticipleSubstitution),
        phrasePairs.map(generateRegularSubstitution)
    );
}

function capitalizePhrases(phrases) {
    return phrases.map(capitalizePhrase);
}

function capitalizePhrase(phrase) {
    return phrase.split(" ").map(capitalizeWord).join(" ");
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

function generateRegularSubstitution(pair) {
    var regExp = new RegExp(pair[0], "g");
    var replacement = pair[1];
    return [regExp, replacement];
}

function generatePastParticipleSubstitution(helpingVerb) {
    var pastParticiple = capitalizeBasedOnReferenceWord(lowerCasePastParticiple, helpingVerb);
    var pastParticipleReplacement = capitalizeBasedOnReferenceWord(lowerCasePastParticipleReplacement, helpingVerb);
    var regExp = new RegExp(helpingVerb + "\\s+(\\w+\\s)?" + pastParticiple, "g");
    var replace = function(_, adverb) {
        return helpingVerb + ' ' + (adverb || '') + ' ' + pastParticipleReplacement;
    };
    return [regExp, replace];
}

function capitalizeBasedOnReferenceWord(phrase, referenceWord) {
    var isLowerCase = startsWithLowerCase(referenceWord);
    return isLowerCase ? phrase : capitalizePhrase(phrase);
}

function startsWithLowerCase(str) {
    var firstLetter = str[0];
    return firstLetter.toLowerCase() === firstLetter;
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
        if (node.parentElement.tagName.toLowerCase() !== "script") {
            callback(node);
        }
    }
}

function isInnovationRelated(node) {
    var text = node.nodeValue;
    return text.match(innovationWords);
}

function convertIntoBullshit(node) {
    node.nodeValue = disruptToBullshit(node.nodeValue);
}

function disruptToBullshit(originalText) {
    return substitutions.reduce(function(text, translationPair) {
        return text.replace(translationPair[0], translationPair[1]);
    }, originalText);
}




