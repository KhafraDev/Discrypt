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
    <svg style="background-color: #40444B" class="bi bi-box-arrow-up" width="1em" height="1em" viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M4.646 4.354a.5.5 0 0 0 .708 0L8 1.707l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"/>
        <path fill-rule="evenodd" d="M8 11.5a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-1 0v9a.5.5 0 0 0 .5.5z"/>
        <path fill-rule="evenodd" d="M2.5 14A1.5 1.5 0 0 0 4 15.5h8a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 12 5.5h-1.5a.5.5 0 0 0 0 1H12a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 0 0-1H4A1.5 1.5 0 0 0 2.5 7v7z"/>
    </svg>`;

    if(buttonParent) {
        buttonParent.appendChild(buttonChild);
        document.getElementById('KHAFRA').addEventListener('click', () => sendMessage());
    } else {
        console.log('button container not found!', document.querySelector('div[class*="buttons-"]:not([aria-label])'));
    }
}

const decryptButtons = () => {
    const messageHeaders = [].concat(
        Array.from(document.querySelectorAll('div[id*="messages-"] > div > h2')),
        Array.from(document.querySelectorAll('span[class*="timestampVisibleOnHover"]'))
    );

    for(const h of messageHeaders) {
        if(h.childNodes.length >= 3) {
            continue;
        }

        const btn = document.createElement('button');
        btn.style = 'background-color: #40444B;';
        btn.id = 'decrypt-message' + messageHeaders.indexOf(h);
        btn.innerHTML = '<span>Decrypt</span>';

        h.appendChild(btn);
        const el = document.getElementById('decrypt-message' + messageHeaders.indexOf(h));
        el.addEventListener('click', () => {
            const enc = el.parentElement.parentElement.parentElement.querySelector('div').querySelector('div');
            if(enc.textContent.length) {
                enc.textContent = sjcl.decrypt('default23', enc.textContent);
                enc.style.border = '1px solid green';
            }
        });
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

    fetch('https://discord.com/api/v6/channels/' + channelID + '/messages', {
        method: 'POST',
        body: JSON.stringify({
            "content": sjcl.encrypt('default23', text, {
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

document.addEventListener('keydown', () => {
    addButton();
    decryptButtons();
});