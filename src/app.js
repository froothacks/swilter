"use strict";
console.log("loaded app.js");

let fetch = require("node-fetch");

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  let options = INSTALL_OPTIONS;
  let element;

  let controlsHTML = `
    <swilter-main>
      <swilter-h1>Swilter</swilter-h1>
      <label class="swilter-switch">
        <input id="swilter-filter-profanity" name="swilter-filter-profanity" type="checkbox" checked>
        <span class="swilter-switch-slider"></span>
      </label>
      <label class="swilter-switch-label" for="swilter-filter-profanity">Filter Profanity</label>
      <label class="swilter-switch">
        <input id="swilter-filter-ad-hominem" name="swilter-filter-ad-hominem" type="checkbox" checked>
        <span class="swilter-switch-slider"></span>
      </label>
      <label class="swilter-switch-label" for="swilter-filter-ad-hominem">Filter Ad Hominem</label>
    </swilter-main>
  `;

  // updateElement runs every time the options are updated.
  // Most of your code will end up inside this function.
  function updateElement () {
    element = INSTALL.createElement(options.location, element);

    // Set the app attribute to your app's dash-delimited alias.
    element.setAttribute('app', 'swilter');

    element.innerHTML = controlsHTML;
  }

  // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
  window.INSTALL_SCOPE = {
    setOptions (nextOptions) {
      options = nextOptions;
      updateElement();
    }
  }

  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement);
  } else {
    updateElement();
  }
}());
