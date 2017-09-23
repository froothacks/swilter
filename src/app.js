(function () {
  'use strict';

  if (!window.addEventListener) return; // Check for IE9+

  let options = INSTALL_OPTIONS;
  let element;

  let controlsHTML = `
    <label class="swilter-switch">
      <input type="checkbox" checked>
      <span class="swilter-switch-slider"></span>

      Swilter
    </label>
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement);
  } else {
    updateElement();
  }
}();)
