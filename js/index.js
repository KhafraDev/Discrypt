let token;
let Fingerprint;

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
 * Add button to document body that will be used to encrypt/decrypt
 */
const addButton = () => {
    const buttonParent = document.querySelector('div[class*="buttons-"]:not([aria-label])');
    if(!buttonParent || buttonParent.children.length === 4) {
        return;
    }

    const buttonChild = document.createElement('button');
    buttonChild.style = 'background-color: #40444B';
    buttonChild.id = 'KHAFRA';
    buttonChild.innerHTML = `
    <svg class="bi bi-lock-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
        <rect width="11" height="9" x="2.5" y="7" rx="2"/>
        <path fill-rule="evenodd" d="M4.5 4a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z"/>
    </svg>`;

    if(buttonParent) {
        buttonParent.appendChild(buttonChild);
        const btn = document.getElementById('KHAFRA');
        btn.addEventListener('click', () => sendMessage());
        // some future animation on mouseover
        // btn.addEventListener('mouseover')
    } else {
        console.log('button container not found!', document.querySelector('div[class*="buttons-"]:not([aria-label])'));
    }
}

/**
 * Get Discord auth token
 */
const getToken = () => {
    const iframe = document.createElement('iframe');
    document.head.append(iframe);
    window.dispatchEvent(new Event('beforeunload'));
    const pd = iframe.contentWindow.localStorage;
    iframe.remove();

    token = JSON.parse(pd.token);
    if(pd.fingerprint) {
        Fingerprint = JSON.parse(pd.fingerprint);
    }
}

const sendMessage = async () => {
    if(!token) {
        getToken();
    }

    const textElement = document.querySelector('span[data-slate-string="true"]');
    if(!textElement) {
        console.log('text element not found on DOM');
        return;
    }

    const text = textElement.textContent;
    if(!text.length) {
        console.log('text element is empty');
        return;
    }

    const channelID = location.href.split('/').pop();
    if(!channelID.split('').every(c => !isNaN(c))) {
        console.log('invalid channelID');
        return;
    }

    const { password } = await browser.runtime.sendMessage({
        pw: true
    });

    fetch('https://discord.com/api/v6/channels/' + channelID + '/messages', {
        method: 'POST',
        body: JSON.stringify({
            "content": sjcl.encrypt(password || 'default23', text, {
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
            'X-Fingerprint': await fingerprint()
        }
    }).then(r => {
        alert('Message sent, status: ' + r.status + ' (' + r.statusText + ').');
    });
}

const fingerprint = async () => {
    if(Fingerprint) {
        return Fingerprint;
    }

    const ContextProperties = btoa(JSON.stringify({ 
        location: 'Login' 
    }));

    const res = await fetch('https://discord.com/api/v6/experiments', {
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US',
            'Content-Type': 'application/json',
            'User-Agent': navigator.userAgent,
            'X-Fingerprint': '',
            'X-Context-Properties': ContextProperties // somehow missed this completely
        }
    });

    const { fingerprint } = await res.json();
    Fingerprint = fingerprint;
    return Fingerprint;
}

chrome.runtime.onMessage.addListener(request => {
    if(request.message === 'com.khafradev.urlUpdate') {
        console.log('khafra says new url is ' + request.url);
        addButton();

        // MutationObservers are still useless, what a surprise.
        // something that could have been useful...

        document.addEventListener('mouseover', e => {
            if( e.target.tagName === 'DIV' && 
                (e.target.children.length === 0 || e.target.childNodes[0].nodeName === '#text')
            ) {
                /**
                 * @type {HTMLElement}
                 */
                const bC = e.target.parentElement.parentElement; //.querySelector('div[class*="buttonContainer"] > div > div');
                const bCC = bC.children[bC.children.length - 1].children[0].children[0];

                if(!bC || !bCC) { 
                    // buttonContainer doesn't exist
                    // most likely would throw an error but w/e
                    return;
                } else if(bCC.children.length === 4) {
                    // if decrypt button is guaranteed to exist already
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

                dupe.addEventListener('click', () => {  
                    browser.runtime.sendMessage({
                        pw: true
                    }).then(
                        m => {
                            if(m.password) {
                                // yikes
                                const _ = dupe.parentElement.parentElement.parentElement.parentElement.children[0].querySelector('div');
                                try {
                                    _.textContent = sjcl.decrypt(m.password, _.textContent);
                                    _.style.border = '1px solid green';
                                } catch(e) {
                                    console.error(e);
                                    _.style.border = '1px solid red';
                                }
                            }
                        }, 
                    );  
                });
            }
        })
    }
});