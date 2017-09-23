"use strict";


function IsSwear(string) {
    var badwordRegex = /(\b(ur mom|(yo)?u suck|8={3,}D|nigg[aeu][rh]?|ass|(ass ?|a|a-)hole|fag(got)?|daf[au][qk]|(brain|mother|mutha)?fuc?k+(a|ing?|e?(r|d)| off+| y(ou|e)(rself)?|u+|tard)?|shit?(t?er|s|head)?|you scum|dickhead|pedo|whore|cunt|cocksucker|ejaculated?|jerk off|cummies|butthurt|queef|(private|pussy) show|pussy|lesbo|bitche?s?|hoe|(eat|suck)\b.{0,20}\b dick|dee[sz]e? nut[sz])s?\b)/;
    var re = new RegExp(badwordRegex);
    return re.exec(string) !== null;
}

function IsOffensive(text) {
    // var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    // var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    //     'username': '087d525b-ce6d-4ba8-9f43-84dc5d45bd74',
    //     'password': '2PD4gITe5Muh',
    //     'version_date': '2017-02-27'
    // });
    // var parameters = {
    //     'text': text,
    //     'features': {
    //         'emotion': {},
    //         'sentiment': {},
    //         // 'keywords': {
    //         //     'sentiment': true,
    //         //     'emotion': true,
    //         //     'limit': 3
    //         // }
    //     }
    // };
    // natural_language_understanding.analyze(parameters, function (err, response) {
    // var sentiment = jsonData["sentiment"]["document"]["score"];
    // var emotionType = jsonData["emotion"]["document"]["emotion"];
    // var anger = emotionType["anger"];
    // var disgust = emotionType["disgust"];
    // var sadness = emotionType["sadness"];
    // var fear = emotionType["fear"];
    // var joy = emotionType["joy"];
    var data = {
        "documents": [
            {
                "language": "en",
                "id": "string",
                "text": "Happy is good"
            }
        ]
    };
    var fetch = require('node-fetch');
    fetch("https://eastus2.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "e6ed6519b56e44a9bd743bd236f4a31c"}
    })
        .then(function (res) {
            return res.json();
        }).then(function (json) {
        console.log(json);
        var sentiment = json["documents"][0]["score"];
        console.log(sentiment);

        // TODO: do the calculation to find if the comment needs to be hidden
        if (sentiment < -0.2) {
            console.log("HIDE ==>O");
            return true;
            // Thus the message is negative and contains anger

        }
        else {
            console.log("PASS");
            return false;

        }
    });


}

// For testing only
function main(text) {


    if (IsSwear(text)) {
        console.log("HIDE ==> S")
    }
    if (IsOffensive(text)) {
        console.log("HIDE ==> O")
    }

}


main("Good job... not")