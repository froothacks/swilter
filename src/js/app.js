(function () {
  "use strict";

  console.log("loaded app.js");

  if (!window.addEventListener) return; // Check for IE9+

  let options = INSTALL_OPTIONS;
  let database, element;

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

  // updateHTML runs every time the options are updated.
  // Most of your code will end up inside this function.
  function updateHTML() {
    element = $(INSTALL.createElement(options.location, element));
    element.attr("app", "swilter");
    element.html(controlsHTML);
  }

  function updateComments() {
    // Initialize Firebase
    // TODO: Replace with your project's customized code snippet
    let config = {
      apiKey: "AIzaSyCSLUyTrce4YAZweq0NGTX71UdVhzPLxQ0",
      authDomain: "swilter-4f741.firebaseapp.com",
      databaseURL: "https://swilter-4f741.firebaseio.com"
    };
    firebase.initializeApp(config);
    database = firebase.database();

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
        writeUserData(commentJSON);
        success(commentJSON);
      },
      getComments: function(success, error) {
        var commentsArray = [];
        database.ref().on("value", function(data) {
          data.forEach(function(childSnapshot) {
            commentsArray.push(childSnapshot.val());
          });
          success(commentsArray);
        });
      }
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
}());
