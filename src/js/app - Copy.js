(function () {
  "use strict";

  console.log("loaded app.js");

  if (!window.addEventListener) return; // Check for IE9+

  let options = INSTALL_OPTIONS;
  let element;

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
        <div id="comments-container">Loading...</div>
      </swilter-main>
    </swilter>
  `;

  // updateElement runs every time the options are updated.
  // Most of your code will end up inside this function.
  function updateElement () {
    element = $(INSTALL.createElement(options.location, element));

    // Set the app attribute to your app's dash-delimited alias.
    element.attr("app", "swilter");

    element.html(controlsHTML);

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
