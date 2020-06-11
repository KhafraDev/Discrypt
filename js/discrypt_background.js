chrome.tabs.onUpdated.addListener((id, change) => {
    // once the page is loaded, fixes "Could not establish connection. Receiving end does not exist."
    if(change.url && change.status === 'complete') {
        chrome.tabs.sendMessage(id, {
            message: 'com.khafradev.urlUpdate',
            url: change.url
        }, Promise.resolve);
    }
});

chrome.runtime.onMessage.addListener((req, _, send) => {
    if(req.pw === true) {
        chrome.storage.local.get('decryptPassword', 
            ({ decryptPassword }) => Promise.resolve(send({ password: decryptPassword }))
        );
        return true;
    }
});