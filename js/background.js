chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if(changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: 'com.khafradev.urlUpdate',
            url: changeInfo.url
        });
    }
});

let password;

chrome.storage.onChanged.addListener(changes => {
    if(changes['decryptPassword']) {
        password = changes['decryptPassword'].newValue;
    }
})
  
chrome.runtime.onMessage.addListener((req, _, send) => {
    if(req.pw === true) {
        if(!password) {
            // who said an async function wasn't allowed? ;)
            new Promise(r => chrome.storage.local.get('decryptPassword', r))
                .then(({ decryptPassword }) => {
                    password = decryptPassword;
                    return send({ password });
                });

            return true;
        }

        return send({ password });
    }
});