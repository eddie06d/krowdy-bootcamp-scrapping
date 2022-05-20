(() => {
  // src/functions/selector.js
  var $2 = (selector, node = document) => node.querySelector(selector);

  // src/functions/waitForElement.js
  var waitForElement = (selector) => new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (!$2(selector).element) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
    setTimeout(() => {
      reject();
    }, 1e4);
  });
  var waitForElement_default = waitForElement;

  // src/scripts/selectors.js
  var SELECTORS = {
    profile: {
      css: {
        fullname: "h1"
      },
      xpath: {
        educationItems: "(//section[.//span[contains(text(),'Educaci\xF3n')]]//ul)[1]/li",
        experiencieItems: "(//section[.//span[contains(text(),'Experiencia')]]//ul)[1]/li"
      }
    },
    search: {
      urlsProfiles: ".search-results-container .ph0 ul.reusable-search__entity-result-list > li span.entity-result__title-text a"
    },
    infoContact: {
      linkedin: "section.pv-contact-info__contact-type .pv-contact-info__ci-container a",
      email: "section.ci-email .pv-contact-info__ci-container a"
    }
  };
  var selectors_default = SELECTORS;

  // src/scripts/scrapperInfoContact.js
  waitForElement_default("div").then(() => {
    const linkedin = $(selectors_default.infoContact.linkedin).href;
    const email = $(selectors_default.infoContact.email).textContent.trim();
    console.log("linkedin:" + linkedin, "email:" + email);
    let port = chrome.runtime.connect({ name: "safePortContact" });
    port.postMessage({ linkedin, email });
  }).catch(() => {
    console.log("intentelo mas tarde");
  });
})();
