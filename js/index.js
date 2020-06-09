const SP = btoa({
    "os": navigator.oscpu.split(' ').shift(),
    "browser": navigator.appCodeName,
    "device": "",
    "browser_user_agent": navigator.userAgent,
    "browser_version": "76.0",
    "os_version": "10",
    "referrer": "",
    "referring_domain": "",
    "referrer_current": "",
    "referring_domain_current": "",
    "release_channel": "stable",
    "client_build_number": 61181,
    "client_event_source": null
});

/**
 * Add button to document body that will be used to encrypt message.
 * Runs on URL change.
 */
const addButton = () => {
    const buttonParent = document.querySelector('div[class*="buttons-"]:not([aria-label])');
    if(!buttonParent || buttonParent.children.length === 4) {
        return;
    }

    const buttonChild = buttonParent.children[0].cloneNode(true);
    buttonChild.style = 'background-color: #40444B';
    buttonChild.id = 'discryptEncrypt';
    buttonChild.setAttribute('aria-label', 'Encrypt Message');
    buttonChild.children[0].innerHTML = `
    <svg class="bi bi-shield-lock-fill" width="24" height="24" viewBox="0 -2 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M5.187 1.025C6.23.749 7.337.5 8 .5c.662 0 1.77.249 2.813.525a61.09 61.09 0 0 1 2.772.815c.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.191 11.191 0 0 1-2.418 2.3 6.942 6.942 0 0 1-1.007.586c-.27.124-.558.225-.796.225s-.526-.101-.796-.225a6.908 6.908 0 0 1-1.007-.586 11.192 11.192 0 0 1-2.417-2.3C2.167 10.331.839 7.221 1.412 3.024A1.454 1.454 0 0 1 2.415 1.84a61.11 61.11 0 0 1 2.772-.815zm3.328 6.884a1.5 1.5 0 1 0-1.06-.011.5.5 0 0 0-.044.136l-.333 2a.5.5 0 0 0 .493.582h.835a.5.5 0 0 0 .493-.585l-.347-2a.5.5 0 0 0-.037-.122z"/>
    </svg>`;

    buttonParent.appendChild(buttonChild);
    buttonChild.addEventListener('click', sendMessage);
}

/**
 * Send a message to the current channel.
 */
const sendMessage = async () => {
    const textElement = document.querySelector('span[data-slate-string="true"]');
    const channelID = location.href.split('/').pop();

    if(!textElement) {
        return; // no text in element
    } else if(!channelID.split('').every(c => !isNaN(c))) {
        return;
    } else if(!token || !fingerprint) {
        alert('A token or fingerprint could not be found in localStorage, please refresh the page to try again!');
        console.log(!token ? 'Token is undefined' : !fingerprint ? 'Fingerprint is undefined' : 'Neither are undefined.');
        return;
    }

    const { password } = await new Promise(r => chrome.runtime.sendMessage({ pw: true }, r));

    if(!password) {
        alert('Please set a password in the popup window for this extension!');
        return;
    }

    try {
        const res = await fetch('https://discord.com/api/v6/channels/' + channelID + '/messages', {
            method: 'POST',
            body: JSON.stringify({
                "content": sjcl.encrypt(password, textElement.textContent, {
                    count: 2048,
                    ks: 256
                }),
                "nonce": Snowflake(),
                "tts": false
            }),
            headers: {
                'User-Agent': navigator.userAgent,
                'Accept-Language': 'en-US',
                'Content-Type': 'application/json',
                'Authorization': token,
                'X-Super-Properties': SP,
                'X-Fingerprint': fingerprint
            }
        });

        if(res.status !== 200) {
            alert('Received status ' + res.status + '! (' + res.statusText + ').');
        }

        textElement.removeAttribute('data-slate-string');
        textElement.setAttribute('data-slate-zero-width', 'z');
        textElement.setAttribute('data-slate-length', '0');
        textElement.textContent = '\ufeff' // zero width no-break space
    } catch(e) {
        console.error('Discrypt Error sending message!', e);
    }
}

chrome.runtime.onMessage.addListener(req => {
    if(req.message === 'com.khafradev.urlUpdate') {
        addButton();

        // MutationObservers are still useless, what a surprise.
        // something that could have been useful...

        document.addEventListener('mouseover', e => {
            if( e.target.tagName === 'DIV' && 
                (e.target.children.length === 0 || e.target.childNodes[0].nodeName === '#text')
            ) {
                /*** @type {HTMLElement} */
                const bC = getParentLikeId(e.target, /messages-\d+/); // parent element to button container.
                const bCC = bC ? bC.querySelector('div[class*="wrapper-"]') : null; // button container

                if(!bC || !bCC) { 
                    // buttonContainer doesn't exist or parent element doesn't
                    return;
                } else if(bCC.children.length === 4) {
                    // if decrypt button is guaranteed to exist already
                    // max children native is 3
                    return;
                } else if(bCC.children.length === 3) {
                    // messages sent by yourself contain 3 buttons, so we check
                    // if one of those buttons is a Discrypt button.
                    if(bCC.children[bCC.children.length - 1].id === 'discrypt') {
                        return;
                    }
                } else if(bCC.className.indexOf('wrapper-') === -1 || bCC.tagName !== 'DIV') {
                    // so we don't choose incorrect elements
                    // ie. path(s) from experience...
                    return;
                }

                // clone the element, so we don't modify the OG
                const dupe = bCC.children[0].cloneNode(true);
                dupe.setAttribute('aria-label', 'discrypt');
                dupe.setAttribute('id', 'discrypt');
                dupe.innerHTML = `
                <svg class="bi bi-check-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                `;

                bCC.appendChild(dupe);

                dupe.addEventListener('click', async () => {  
                    const { password } = (await new Promise(r => chrome.runtime.sendMessage({ pw: true }, r)));

                    if(password) {
                        const _ = bC.querySelector('div[class*="messageContent-"]');
                        if(!_) {
                            return; 
                        }

                        try {
                            _.textContent = sjcl.decrypt(password, _.textContent);
                            _.style.border = '1px solid green';
                        } catch(e) {
                            _.style.border = '1px solid red';
                        }
                    }  
                });
            }
        });
    }
});

/**
 * Get a (grand-grand-nth)parent element that matches id.
 * @example
 *  const element = getParentLikeId(document.querySelector('.child'), 'message-'); // HTMLElement
 *  const element = getParentLikeId(document.querySelector('.child'), 'non-existent'); // undefined
 * @param {HTMLElement} e element
 * @param {string|RegExp} id element ID to get
 * @returns {HTMLElement} parent element
 */
const getParentLikeId = (e, id) => {
    while(e = e.parentElement) {
        if(e.id.match(id)) {
            return e;
        }
    }
}

// only needs to run once to propagate decrypt password on load
window.addEventListener('load', () => chrome.runtime.sendMessage({ pw: true }, () => {}));