/**
 * Send a message to the current channel.
 */
const sendMessage = async () => {
    const textElements = document.querySelectorAll('span[data-slate-string="true"]');
    const [, channelID] = location.pathname.match(/\/channels\/\d+\/(\d+)/);

    if(textElements.length === 0) {
        return; // no text in element
    } else if(isNaN(channelID)) {
        return;
    } else if(!token || !fingerprint) {
        console.warn('[Discrypt]: ' + (!token ? 'Token is undefined' : !fingerprint ? 'Fingerprint is undefined' : 'Neither are undefined.'));
        return;
    }

    const { password } = await getPassword();
    if(!password) {
        alert('Please set a password in the popup window for this extension!');
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Host': location.host,
            'User-Agent': navigator.userAgent,
            'Accept-Language': navigator.language,
            'Authorization': token,
            'X-Super-Properties': SP,
            'X-Fingerprint': fingerprint
        }
    };

    const message = [...textElements].map(e => e.textContent).join('\n');
    const enc = sjcl.encrypt(password, message, {
        count: 2048,
        ks: 256
    });

    if(enc.length <= 2000) {
        options.body = JSON.stringify({
            content: enc,
            nonce: Snowflake(),
            tts: false
        });
        options.headers['Content-Type'] = 'application/json'; // required
    } else {
        const formData = new FormData();
        formData.append('tts', false);
        formData.append('content', '');
        formData.append('file', new Blob([enc], { type: 'text/plain' }), 'discryptUpload.txt');

        // sending a Content-Type header causes the response to fail.
        // FormData should automatically set it.
        options.body = formData;
    }

    const res = await fetch('https://discord.com/api/v6/channels/' + channelID + '/messages', options);

    if(!res.ok) {
        alert('Received status ' + res.status + '! (' + res.statusText + ').');
    }
}

/**
 * Handle mutations when nodes are added.
 * @param {Iterable} Mutations 
 */
const MutationCallback = Mutations => {
    for(const m of Mutations) {
        if(m.type === 'childList' && m.addedNodes[0]?.className?.search(/buttonContainer-(.*)/) > -1) {
            /**
             * parent element to button container
             * @type {HTMLElement}
             */
            const bCP = m.target.id.indexOf('messages-') > -1 ? m.target : getParentLikeProp(m.addedNodes[0], 'id', /messages-(\d+)/);
            const bC = bCP ? bCP.querySelector('div[class*="buttons-"] > div[class*="wrapper-"]') : null;

            if(!bC) {
                return;
            } else if(bC.className.indexOf('wrapperPaused-') !== -1) {
                // some elements contain wrapper- classes but aren't text like
                // images and possibly formatted text, should be handled already
                // but this is a precaution.
                return;
            } else if(bC.children[bC.children.length - 1].id === 'discrypt') {
                // decrypt button already exists
                // another precaution since it shouldn't occur
                return;
            }
            
            addDecrypt([bC]);
        }
    }
};

chrome.runtime.onMessage.addListener((req, _, send) => {
    if(req.message === 'discryptURLUpdate') {
        addButton();
        addDecrypt(document.querySelectorAll('div[class*="buttons-"] > div[class*="wrapper-"]'));

        /** container for message list */
        const messagesContainer = document.getElementById('messages');
        if(messagesContainer instanceof HTMLElement) {
            const observer = new MutationObserver(MutationCallback);
            
            observer.observe(messagesContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    // Chrome will throw an error without a return value
    send({});
    return true;
});