import waitForElement from "../functions/waitForElement"
import SELECTORS from "./selectors";

waitForElement('div')
   .then(()=>{
        const linkedin = $(SELECTORS.infoContact.linkedin).href;
        const email = $(SELECTORS.infoContact.email).textContent.trim();

        console.log("linkedin:"+linkedin,"email:"+email);

        let port = chrome.runtime.connect({name:"safePortContact"})
        port.postMessage({linkedin, email})
   })
   .catch(()=>{console.log("intentelo mas tarde")})