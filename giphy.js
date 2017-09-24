let fetch = require('node-fetch');

function getGIPHY(keywords=["cats","dogs","bears","love"]) {
    searchQ = keywords[Math.floor(Math.random() * keywords.length) - 1];
    console.log(searchQ);
    return fetch("https://api.giphy.com/v1/gifs/search?api_key=GBov9dSMPUy2DLg9DMO0miWJlBP3sEo4&q=" + searchQ + "&limit=1&offset=0&rating=G&lang=en")
        .then(res => {
            return res.json();
        })
        .then(json => {
            return json["data"][0]["embed_url"];
        });
}

getGIPHY().then(url => {
    console.log("url " + url);
});