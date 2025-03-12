chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const allowedSites = ["zoom.us", "meet.google.com"];
        const url = new URL(tab.url);
        
        if (!allowedSites.some(site => url.hostname.includes(site))) {
            console.log("Blocked: This extension only works on Zoom and Google Meet.");
            return;
        }

        console.log("Extension active on:", url.hostname);
    }
});
