(function ($) {
  "use strict";
  //let fetch = require("node-fetch");
  //var $ = require('jQuery');
  function isSwear(string) {
      let badwordRegex = /(\b(ur mom|(yo)?u suck|8={3,}D|nigg[aeu][rh]?|ass|(ass ?|a|a-)hole|fag(got)?|daf[au][qk]|(brain|mother|mutha)?fuc?k+(a|ing?|e?(r|d)| off+| y(ou|e)(rself)?|u+|tard)?|shit?(t?er|s|head)?|you scum|dickhead|pedo|whore|cunt|cocksucker|ejaculated?|jerk off|cummies|butthurt|queef|(private|pussy) show|pussy|lesbo|bitche?s?|hoe|(eat|suck)\b.{0,20}\b dick|dee[sz]e? nut[sz])s?\b)/;
      let re = new RegExp(badwordRegex);
      return re.exec(string) !== null;
  }
  function isOffensive(text, funct, commentJSON) {

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
      console.log("HEREEE");
      $.ajax({
          url : "https://eastus2.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
          type: "POST",
          headers: {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "b0df8262f41e49e98c4d043237ae5c65"},
          data : JSON.stringify(data),
          success: function(data, textStatus, jqXHR)
          {
              console.log("in");
              console.log(data);
              let sentiment = data["documents"][0]["score"];
              console.log("Me"+sentiment);
              resultingStuff = sentiment < 0.2;
              commentJSON["isOffensive"] = resultingStuff;
              writeUserData(commentJSON);
              funct(commentJSON);
              return resultingStuff;
          },
          error: function (jqXHR, textStatus, errorThrown)
          {
            console.log("bad stuff");
            return "FAIL";
          }
      });
       // return fetch("https://eastus2.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment", {
       //        method: 'POST',
       //        body: JSON.stringify(data),
       //        headers: {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "b0df8262f41e49e98c4d043237ae5c65"}})
       //        .then(res => res.json())
       //        .then(json => {
       //            console.log(json);
       //            let sentiment = json["documents"][0]["score"];
       //            console.log("Me"+sentiment);
       //            resultingStuff = sentiment < 0.03;
       //            return resultingStuff;
       //        });

  }

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

  console.log("loaded app.js");

  if (!window.addEventListener) return; // Check for IE9+

  let options = INSTALL_OPTIONS;
  let database, element;

  let filters = {
    "profanity": options.filterProfanity,
    "adHominem": options.filterAdHominem
  }

  let controlsHTML = `
    <swilter>
      <swilter-h1>Swilter Comments</swilter-h1>
      <swilter-nav>
        <label class="swilter-switch">
          <input id="swilter-filter-profanity" name="swilter-filter-profanity" type="checkbox" ${options.filterProfanity?"checked":""}>
          <span class="swilter-switch-slider"></span>
        </label>
        <label class="swilter-switch-label" for="swilter-filter-profanity">Filter Profanity</label>
        <label class="swilter-switch">
          <input id="swilter-filter-ad-hominem" name="swilter-filter-ad-hominem" type="checkbox" ${options.filterAdHominem?"checked":""}>
          <span class="swilter-switch-slider"></span>
        </label>
        <label class="swilter-switch-label" for="swilter-filter-ad-hominem">Filter Ad Hominem</label>
      </swilter-nav>
      <swilter-main>
        <input id="swilter-name-input" type="text" placeholder="Name" />
        <div id="comments-container">Loading...</div>
      </swilter-main>
    </swilter>
  `;

  function writeUserData(commentJSON) {
    var n = 0;
    database.ref().on("value", function(data) {
      n = data.numChildren();
    });
    var payload = {};
    payload[n] = commentJSON;
    firebase.database().ref().update(payload);
  }

  function readAllData() {
    var commentsArray = [];
    database.ref().on("value", function(data) {
      data.forEach(function(childSnapshot) {
        commentsArray.push(childSnapshot.val());
      });
      return commentsArray;
    });
  }

  function updateHTML() {
    // updateHTML runs every time the options are updated.
    // Most of your code will end up inside this function.
    element = $(INSTALL.createElement(options.location, element));
    element.attr("app", "swilter");
    element.html(controlsHTML);

    // Initialize Firebase
    // TODO: Replace with your project's customized code snippet
    let config = {
      apiKey: "AIzaSyCSLUyTrce4YAZweq0NGTX71UdVhzPLxQ0",
      authDomain: "swilter-4f741.firebaseapp.com",
      databaseURL: "https://swilter-4f741.firebaseio.com"
    };
    firebase.initializeApp(config);
    database = firebase.database();
  }

  function updateComments() {
    if ($('#comments-container').hasClass("jquery-comments")) {
      $('#comments-container').html("")
    }
    $('#comments-container').comments({
      profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
      postComment: function(commentJSON, success, error) {
        var nameInput = $("#swilter-name-input").val();
        if (nameInput === "") {
          alert("Please enter a valid name!");
          error();
          return;
        }
        commentJSON["fullname"] = nameInput;

        commentJSON["isSwear"] = isSwear(commentJSON["content"]);
        console.log("NINEINIENEIE");
        isOffensive(commentJSON["content"], success, commentJSON);

        updateComments();
        // $.when(isOffensive(commentJSON["content"])).done(function(value) {
        //   commentJSON["isOffensive"] = value;
        // });

        // isOffensive(commentJSON["content"]).then((value) => {
        //   commentJSON["isOffensive"] = value;          
        //   writeUserData(commentJSON);
        //   success(commentJSON);
        // });

        // writeUserData(commentJSON);
        // success(commentJSON);
      },
      getComments: function(success, error) {
        var commentsArray = [];
        database.ref().on("value", function(data) {
          data.forEach(function(childSnapshot) {
            // console.log(childSnapshot.val());
            if ( !(filters.profanity && childSnapshot.val().isSwear)
              && !(filters.adHominem && childSnapshot.val().isOffensive)) {
              commentsArray.push(childSnapshot.val());
            }
            else {
              let cleanComment = childSnapshot.val();
              cleanComment.content = "🔥🔥🔥";
              commentsArray.push(cleanComment);
            }
          });
          success(commentsArray);
        });
      }
    });

    $("#swilter-filter-profanity").off("change").change(function() {
      filters.profanity = this.checked;
      updateComments();
    });

    $("#swilter-filter-ad-hominem").off("change").change(function() {
      filters.adHominem = this.checked;
      updateComments();
    });
  }

  function update() {
    updateHTML();
    updateComments();
  }

  // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      options = nextOptions;
      update();
    }
  }

  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
}(jQuery));
