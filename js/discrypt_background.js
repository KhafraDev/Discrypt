chrome.tabs.onUpdated.addListener((id, change, tab) => {
    if(change.status === 'complete') {
        const { host } = new URL(tab.url);
        if(host === 'discord.com') {
            chrome.tabs.sendMessage(id, {
                message: 'discryptURLUpdate',
                url: tab.url
            }, Promise.resolve);
        }
    }

    return true;
});

chrome.runtime.onMessage.addListener((req, _, s) => {
    if(req.pw === true) {
        chrome.storage.local.get(
            'decryptPassword', 
            ({ decryptPassword }) => Promise.resolve(s({ password: decryptPassword }))
        );
    }

    return true;
});