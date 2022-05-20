const SELECTORS = {
    profile:{
        css:{
            fullname: "h1"

        },
        xpath:{
            educationItems: "(//section[.//span[contains(text(),'Educación')]]//ul)[1]/li",
            experiencieItems: "(//section[.//span[contains(text(),'Experiencia')]]//ul)[1]/li"
        }
    },
    search:{
        urlsProfiles:".search-results-container .ph0 ul.reusable-search__entity-result-list > li span.entity-result__title-text a"
    },
    infoContact: {
        linkedin: "section.pv-contact-info__contact-type .pv-contact-info__ci-container a",
        email: "section.ci-email .pv-contact-info__ci-container a"
    }
}  

export default SELECTORS