"use strict";
var unirest = require('unirest');
let fetch = require("node-fetch");
function IsSwear(string) {
    var badwordRegex = /(\b(ur mom|(yo)?u suck|8={3,}D|nigg[aeu][rh]?|ass|(ass ?|a|a-)hole|fag(got)?|daf[au][qk]|(brain|mother|mutha)?fuc?k+(a|ing?|e?(r|d)| off+| y(ou|e)(rself)?|u+|tard)?|shit?(t?er|s|head)?|you scum|dickhead|pedo|whore|cunt|cocksucker|ejaculated?|jerk off|cummies|butthurt|queef|(private|pussy) show|pussy|lesbo|bitche?s?|hoe|(eat|suck)\b.{0,20}\b dick|dee[sz]e? nut[sz])s?\b)/;
    var re = new RegExp(badwordRegex);
    return re.exec(string) !== null;
}

// function IsOffensive(text) {
//     var sentiment;
//     var request = unirest.post("https://eastus2.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment")
//         .headers({"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "e6ed6519b56e44a9bd743bd236f4a31c"})
//         .send({
//             "documents": [
//                 {
//                     "language": "en",
//                     "id": "string",
//                     "text": text
//                 }
//             ]
//         })
//         .end(function (response) {
//             // console.log(response)
//             var data = response.body;
//             sentiment = data
//             return sentiment["documents"][0]["score"];
//         });
//
//
// }


function IsOffensive(text) {

    var resultingStuff;
    var data = {
        "documents": [
            {
                "language": "en",
                "id": "string",
                "text": text
            }
        ]
    };

     return fetch("https://eastus2.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "b0df8262f41e49e98c4d043237ae5c65"}})
            .then(res => res.json())
            .then(json => {
                console.log(json)
                var sentiment = json["documents"][0]["score"];
                console.log("Me"+sentiment);

                if (sentiment < 0.03) {
                    console.log("HIDE ==>O");
                    resultingStuff = true;
                    // Thus the message is negative and contains anger

                }
                else {
                    console.log("PASS");
                    resultingStuff = false;


                }
                return resultingStuff;
            });

}

// For testing only
function main(text) {

    (IsSwear(text));
    console.log(IsOffensive(text));
    if (IsSwear(text)) {
        // console.log("HIDE ==> S")
    }
    else {

        // console.log("HIDE ==> O")
    }
}


main("Good job... not");