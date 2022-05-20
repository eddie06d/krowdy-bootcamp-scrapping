import autoscrolling from "../functions/autoscrolling.js";
import { $, $$, $x } from "../functions/selector.js";
import waitForElement from "../functions/waitForElement.js";
import SELECTORS from "./selectors.js";

waitForElement('h1')
   .then(()=>{
      autoscrolling(30).then(()=>{
         const fullName = $(SELECTORS.profile.css.fullname).textContent
         const experienceItems = $x(SELECTORS.profile.xpath.experiencieItems)
         const educationItems = $x(SELECTORS.profile.xpath.educationItems)
         
         const pruebaExperience = experienceItems.map(element => {
            const aux = $$('span[aria-hidden="true"]',element)?.map(el => el.textContent);
            return {
               role: aux[0] || "",
               company: aux[1].split('.')[0].trim() || "",
               typeWork: aux[1].split('.')[1].trim() || "",
               period: aux[2] || "",
               place: aux[3] || "",
               description: aux[4] || ""  
            };
         });
         
         const pruebaEducation = educationItems.map(element=>{
            const aux = $$('span[aria-hidden="true"]',element)?.map(el => el.textContent);
            return {
               school: aux[0] || "",
               degree: aux[1] || "",
               period: aux[2] || "",
            };
         });
         
         let port = chrome.runtime.connect({name:"safePort"})
         port.postMessage({fullName,pruebaExperience, pruebaEducation})
      })
   })
   .catch(()=>{console.log("intentelo mas tarde")})
