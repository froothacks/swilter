(function ($) {
  "use strict";

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

  function isSwear(string) {
    let dontReadThisRegex = /(\b(ur mom|(yo)?u suck|8={3,}D|nigg[aeu][rh]?|ass|(ass ?|a|a-)hole|fag(got)?|daf[au][qk]|(brain|mother|mutha)?fuc?k+(a|ing?|e?(r|d)| off+| y(ou|e)(rself)?|u+|tard)?|shit?(t?er|s|head)?|you scum|dickhead|pedo|whore|cunt|cocksucker|ejaculated?|jerk off|cummies|butthurt|queef|(private|pussy) show|pussy|lesbo|bitche?s?|hoe|(eat|suck)\b.{0,20}\b dick|dee[sz]e? nut[sz])s?\b)/;
    let re = new RegExp(dontReadThisRegex);
    return re.exec(string) !== null;
  }

  function isOffensive(text, funct, commentJSON) {
    let result;
    let data = {
      "documents": [{
        "language": "en",
        "id": "string",
        "text": text
      }]
    };
    $.ajax({
      url : "https://eastus2.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
      type: "POST",
      headers: {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "b0df8262f41e49e98c4d043237ae5c65"},
      data : JSON.stringify(data),
      success: function(data, textStatus, jqXHR) {
        let sentiment = data["documents"][0]["score"];
        result = sentiment < 0.2;
        commentJSON.isOffensive = result;
        writeUserData(commentJSON);
        funct(commentJSON);
        return result;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        return "Error";
      }
    });
  }

  function getGiphy(array, data, ind) {
    console.log(data);
    if (ind >= data.length) {
      return array
    }
    let searchQ = ["cats", "dogs", "cute"][Math.floor(Math.random() * 3) - 1];
    let entry = data[ind];
    console.log(entry);
    let comment = entry.val();
    if ( !(filters.profanity && comment.isSwear)
      && !(filters.adHominem && comment.isOffensive)) {
      array.push(comment);
      getGiphy(array, data, ind+1);
      console.log("clean:", comment.content);
    }
    else {
      $.ajax({
          url: "http://api.giphy.com/v1/gifs/search?api_key=GBov9dSMPUy2DLg9DMO0miWJlBP3sEo4&q=" + searchQ + "&limit=1&offset=0&rating=G&lang=en",
          type: "GET",
          success: function(data) {

           comment.file_mime_type = "image/gif";
             let url = data[0].url
             url = "https://media0" + url.substring(14); 
             comment.content = url;

             console.log(url); // here is where I'm having an issue!
             array.push(comment)
             getGiphy(array, data, ind+1);
          }
      });
    }
  }

  function writeUserData(commentJSON) {
    let n = 0;
    database.ref().on("value", function(data) {
      n = data.numChildren();
    });
    let payload = {};
    payload[n] = commentJSON;
    firebase.database().ref().update(payload);
  }

  function readAllData() {
    let commentsArray = [];
    database.ref().on("value", function(data) {
      data.forEach(function(entry) {
        commentsArray.push(entry.val());
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
    if ($("#comments-container").hasClass("jquery-comments")) {
      $("#comments-container").html("");
    }
    $("#comments-container").comments({
      enableAttachments: true,
      profilePictureURL: "https://app.viima.com/static/media/user_profiles/user-icon.png",
      postComment: function(commentJSON, success, error) {
        let nameInput = $("#swilter-name-input").val();
        if (nameInput === "") {
          alert("Please enter a valid name!");
          error();
          return;
        }
        commentJSON.fullname = nameInput;
        commentJSON.isSwear = isSwear(commentJSON.content);
        isOffensive(commentJSON.content, success, commentJSON);
        updateComments();
      },
      getComments: function(success, error) {
        let commentsArray = [];
        let comment;
        database.ref().on("value", function(data) {
          console.log("DATAAA");
          console.log(data);
          success(getGiphy(commentsArray, data, 0));
          // data.forEach(function(entry) {
          //   if ( !(filters.profanity && entry.val().isSwear)
          //     && !(filters.adHominem && entry.val().isOffensive)) {
          //     commentsArray.push(entry.val());
          //     console.log("clean:", entry.val().content);
          //   }
          //   else {
          //     comment = entry.val();
          //     comment.file_mime_type = "image/gif";
          //     // comment.content = "";
          //     // delete comment.content;
          //     getGiphy(commentsArray, comment);
          //   }
        });
      },
      refresh: function() {
        $('.comment-wrapper a[href^="https://media0.giphy.com"').each(function() {
          let url = $(this).prop("href");
          $(this).replaceWith(`<img src="${url}">`);
        });
        console.log("in refresh");
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
