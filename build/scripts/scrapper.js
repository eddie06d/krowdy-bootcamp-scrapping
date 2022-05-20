(() => {
  // src/functions/autoscrolling.js
  var autoscrolling = (pixels) => new Promise((resolve, reject) => {
    let pixelstoScroll = pixels;
    console.log(pixelstoScroll);
    const idInterval = setInterval(() => {
      window.scrollTo(0, pixelstoScroll);
      pixelstoScroll += pixels;
      if (pixelstoScroll > document.body.scrollHeight) {
        clearInterval(idInterval);
        resolve(true);
      }
    }, 100);
  });
  var autoscrolling_default = autoscrolling;

  // src/functions/selector.js
  var $ = (selector, node = document) => node.querySelector(selector);
  var $$ = (selector, node = document) => [...node.querySelectorAll(selector)];
  var $x = (xpath, node = document) => {
    const collection = document.evaluate(xpath, node, null, XPathResult.ANY_TYPE, null);
    let result = collection.iterateNext();
    const elements = [];
    while (result) {
      elements.push(result);
      result = collection.iterateNext();
    }
    return elements;
  };

  // src/functions/waitForElement.js
  var waitForElement = (selector) => new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (!$(selector).element) {
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

  // src/scripts/scrapper.js
  waitForElement_default("h1").then(() => {
    autoscrolling_default(30).then(() => {
      const fullName = $(selectors_default.profile.css.fullname).textContent;
      const experienceItems = $x(selectors_default.profile.xpath.experiencieItems);
      const educationItems = $x(selectors_default.profile.xpath.educationItems);
      const pruebaExperience = experienceItems.map((element) => {
        const aux = $$('span[aria-hidden="true"]', element)?.map((el) => el.textContent);
        return {
          role: aux[0] || "",
          company: aux[1].split(".")[0].trim() || "",
          typeWork: aux[1].split(".")[1].trim() || "",
          period: aux[2] || "",
          place: aux[3] || "",
          description: aux[4] || ""
        };
      });
      const pruebaEducation = educationItems.map((element) => {
        const aux = $$('span[aria-hidden="true"]', element)?.map((el) => el.textContent);
        return {
          school: aux[0] || "",
          degree: aux[1] || "",
          period: aux[2] || ""
        };
      });
      let port = chrome.runtime.connect({ name: "safePort" });
      port.postMessage({ fullName, pruebaExperience, pruebaEducation });
    });
  }).catch(() => {
    console.log("intentelo mas tarde");
  });
})();
