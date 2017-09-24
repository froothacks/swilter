"use strict";
let fetch = require("node-fetch");
function IsSwear(string) {
    let badwordRegex = /(\b(ur mom|(yo)?u suck|8={3,}D|nigg[aeu][rh]?|ass|(ass ?|a|a-)hole|fag(got)?|daf[au][qk]|(brain|mother|mutha)?fuc?k+(a|ing?|e?(r|d)| off+| y(ou|e)(rself)?|u+|tard)?|shit?(t?er|s|head)?|you scum|dickhead|pedo|whore|cunt|cocksucker|ejaculated?|jerk off|cummies|butthurt|queef|(private|pussy) show|pussy|lesbo|bitche?s?|hoe|(eat|suck)\b.{0,20}\b dick|dee[sz]e? nut[sz])s?\b)/;
    let re = new RegExp(badwordRegex);
    return re.exec(string) !== null;
}
function IsOffensive(text) {

    let resultingStuff;
    let data = {
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
                console.log(json);
                let sentiment = json["documents"][0]["score"];
                console.log("Me"+sentiment);
                resultingStuff = sentiment < 0.03;
                return resultingStuff;
            });

}

