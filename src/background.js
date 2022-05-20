import URLS from "./config.js"

let tabId;
let tabIdInfo;
let contact;

//const searchWord = prompt("¿Qué buscas?");
//searchWord.replace(/\s/g, "%20");

chrome.action.onClicked.addListener(tab=>{
    const searchWord = 'backend%20developer';
    
    chrome.tabs.create({
        url: `${URLS.base}${searchWord}`
    }, tab =>{
        tabId = tab.id
        chrome.scripting.executeScript({
            target:{tabId: tab.id},
            files:["./scripts/getUrls.js"]
        })
    })
   
})

let guardian = 0;
let urls;
let urlsInfo;

chrome.runtime.onConnect.addListener(port=>{
    if(port.name==="safePort"){
        port.onMessage.addListener(async message=>{
            console.log(message, contact);
            //await db.profiles.add({...message, ...contact})
            fetch("http://localhost:3000/profiles",{
                method: "POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({...message, ...contact})
            }).then(response=>response.json())
                .then(data=>console.log(data))
                .catch(error=>console.log(error))
            console.log("datos guardados en json-server")
            console.log(guardian)
            if(guardian<urls.length){
                /* tabIdInfo = await chrome.tabs.create({ url: urlsInfo[guardian] });
 */
                /* setTimeout(async ()=>{
                    await chrome.scripting.executeScript({
                        target: {tabId: tabIdInfo.id},
                        files: ['./scripts/scrapperInfoContact.js']    
                    })
                    await chrome.tabs.remove(tabIdInfo.id);
                },5000)
 */
                await chrome.tabs.update(tabId,{url:urls[guardian]})
    
                setTimeout(()=>{
                    chrome.scripting.executeScript({
                        target: {tabId},
                        files: ['./scripts/scrapper.js']    
                    }) 
                },5000)
    
                guardian++

            }
        })
    }else if(port.name==="safePortUrls"){
        port.onMessage.addListener(async message=>{
            
            urls = message.urlsProfiles
            //urlsInfo = message.urlsProfilesInfo
            
            const [url] = urls
            //const [urlInfo] = urlsInfo

           /*  tabIdInfo = await chrome.tabs.create({ url: urlInfo });

            setTimeout(()=>{
                chrome.scripting.executeScript({
                    target: {tabId: tabIdInfo.id},
                    files: ['./scripts/scrapperInfoContact.js']    
                })
                chrome.tabs.remove(tabIdInfo.id);
            },3000) */

            await chrome.tabs.update(tabId,{url})

            setTimeout(()=>{
                chrome.scripting.executeScript({
                    target: {tabId},
                    files: ['./scripts/scrapper.js']    
                }) 
            },5000)
            guardian++
                
        })
    }else if(port.name === "safePortContact") {
        port.onMessage.addListener(message => {
            console.log("message:",message);
            contact = message;
        });
    }
})

