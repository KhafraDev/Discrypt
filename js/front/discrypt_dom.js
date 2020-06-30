/**
 * Add button to document body that will be used to encrypt message.
 * Runs on URL change.
 */
const addButton = () => {
    const buttonParent = document.querySelector('div[class*="buttons-"]:not([aria-label])');
    // in channels where a user doesn't have permission to type and react, there are no children
    // Fixes "Unchecked lastError value: Error: buttonParent.children[0] is undefined"
    // that would throw an error in the background script and give some default error message.
    if(!buttonParent || buttonParent.children.length === 4 || buttonParent.children.length === 0) {
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

const addDecrypt = bC => {
    for(const el of Array.from(bC)) {
        const dupe = el.children[0].cloneNode(true);
        dupe.setAttribute('aria-label', 'discrypt');
        dupe.setAttribute('id', 'discrypt');
        dupe.innerHTML = `
        <svg class="bi bi-check-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
        `;

        el.appendChild(dupe);
        dupe.addEventListener('click', decryptButtonCallback);
    }
}

const decryptButtonCallback = async ({ target }) => {
    const message = getParentLikeProp(target, 'id', 'messages-');
    const m = message.querySelector('div[class*="messageContent-"]');
    const { password } = await getPassword();

    if(!password) {
        return;
    } else if(['1px solid green', '1px solid aquamarine'].includes(m.style.border)) {
        m.textContent = m.getAttribute('discrypt').length <= 2000 ? m.getAttribute('discrypt') : '';
        m.style.border = '0px';
        return;
    } else if(!m.textContent.length) {
        const file = message.querySelector('div[class*="attachment-"] a');
        const href = file.getAttribute('href') ?? file.href;
        if(
            !file || // file element not found, not embedded into message
            !href || // embed doesn't have href value
            !href.endsWith('.txt') || // not txt file
            href.indexOf('https://cdn.discordapp.com/') !== 0 // not Discord's CDN
        ) {
            return;
        }

        const res = await fetch(file.href);
        const t = await res.text(); // contents of file

        try {
            m.setAttribute('discrypt', t);
            m.textContent = sjcl.decrypt(password, t, {
                count: 2048,
                ks: 256
            });
            m.style.visibility = 'visible';
            m.style.border = '1px solid aquamarine';
        } catch {
            m.style.visibility = 'hidden';
        } finally {
            return;
        }
    }
    
    try { // bad password will throw an error
        m.setAttribute('discrypt', m.textContent);
        m.textContent = sjcl.decrypt(password, m.textContent, {
            count: 2048,
            ks: 256
        });
        m.style.border = '1px solid green';
    } catch {
        m.style.border = '1px solid red';
    }
};