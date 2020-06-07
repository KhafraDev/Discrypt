chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if(changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: 'com.khafradev.urlUpdate',
            url: changeInfo.url
        });
    }
});

let password;

browser.storage.onChanged.addListener((changes) => {
    if(changes['decryptPassword']) {
        password = changes['decryptPassword'].newValue;
    }
})
  
browser.runtime.onMessage.addListener((req, _, send) => {
    if(req.pw === true) {
        send({ password });
    }
});