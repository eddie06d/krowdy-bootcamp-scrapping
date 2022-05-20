(() => {
  // src/config.js
  var URL = {
    base: "https://www.linkedin.com/search/results/people/?keywords="
  };
  var config_default = URL;

  // src/background.js
  var tabId;
  var contact;
  chrome.action.onClicked.addListener((tab) => {
    const searchWord = "backend%20developer";
    chrome.tabs.create({
      url: `${config_default.base}${searchWord}`
    }, (tab2) => {
      tabId = tab2.id;
      chrome.scripting.executeScript({
        target: { tabId: tab2.id },
        files: ["./scripts/getUrls.js"]
      });
    });
  });
  var guardian = 0;
  var urls;
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "safePort") {
      port.onMessage.addListener(async (message) => {
        console.log(message, contact);
        fetch("http://localhost:3000/profiles", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ ...message, ...contact })
        }).then((response) => response.json()).then((data) => console.log(data)).catch((error) => console.log(error));
        console.log("datos guardados en json-server");
        console.log(guardian);
        if (guardian < urls.length) {
          await chrome.tabs.update(tabId, { url: urls[guardian] });
          setTimeout(() => {
            chrome.scripting.executeScript({
              target: { tabId },
              files: ["./scripts/scrapper.js"]
            });
          }, 5e3);
          guardian++;
        }
      });
    } else if (port.name === "safePortUrls") {
      port.onMessage.addListener(async (message) => {
        urls = message.urlsProfiles;
        const [url] = urls;
        await chrome.tabs.update(tabId, { url });
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId },
            files: ["./scripts/scrapper.js"]
          });
        }, 5e3);
        guardian++;
      });
    } else if (port.name === "safePortContact") {
      port.onMessage.addListener((message) => {
        console.log("message:", message);
        contact = message;
      });
    }
  });
})();
