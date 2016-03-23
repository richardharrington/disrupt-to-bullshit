window.CONVERSION_RULES = (function() {

    return {



//        If BDS->Big Bad Wolf,
//        "Boycott(s)(,) Divestment (and|&) Sanctions" -> Blow Your House Down

        //BDS -> Big Bad Wolfing
//        "Boycott(s)(,) Divestment (and|&) Sanctions" -> Blowing Houses Down


        prePassCustomReplacements: [
            [/Donald Trump/g, "King Ahasuerus of Persia"],
            [/Trump/g, "Ahasuerus"],
            [/([tT]he) Donald/gi, "$1 Ahasuerus"],
            [/Judaism/g, "Utter and Completely Amazing Judaism"],
            [/Jewishness/g, "Amazing Jewishness"],
            [/Jewish\b/g, "Amazing and Jewish"],
            [/Sheldon Adelson/g, "Sheldon ‘Hot Stuff’ Adelson"],
            [/Jews/g, "Jews!"],
            [/Jew\b/g, "Jew!"],
            [/Boycotts?\W*?Divestment\W*?(and)?\W*?Sanctions/g, "Blowing Houses Down"],
            [/boycotts?\W*?divestment\W*?(and)?\W*?sanctions/g, "blowing houses down"],
            [/Boycotts?\W*?divestment\W*?(and)?\W*?sanctions/g, "Blowing houses down"]

        ],
        midPassCustomReplacements: [],

        customMapToLowerCase: {
            'bds': 'big bad wolfing',

        },

        rootVerb: 'zion',
        rootConversion: 'pixie elf',
        helpingVerbs: [],
        pastParticipleMapToLowerCase: {  },

        suffixMapToLowerCase: {
            ists: 'pixie elves',
            ist: 'pixie elf',
            ism: 'pixie elf dancing',
            '': 'pixie elfland'
        }

    };
})();



// apostrophe (single quote at end, something besides a single quote at beginning)
[ /([^\u2018\x27])(disrupt(?:s|ts|ing|ed)?)([\u2019\x27])/gi, function(_, precedingChar, disrupt, apostrophe) {
    return precedingChar + mapToBullshit[disrupt] + apostrophe;
}]


// “Jewish”
// —> “Amazing and Jewish”

// "Sheldon Adelson”
// —> “Sheldon ‘Hot Stuff’ Adelson”



// Can we change
// “Jews” to “Jews!”
// “Trump” to “Ahasuerus”
// and
// “Donald Trump” to “King Ahasuerus of Persia”

// ?
//
