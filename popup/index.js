document.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault(); // so form doesn't reset
    if(!e.target[0].value.length) {
        return;
    }

    try {
        // Firefox allows promises, Chrome doesn't.
        if(typeof browser !== "undefined") {
            await browser.storage.local.set({
                decryptPassword: e.target[0].value
            });
        } else {
            await new Promise(r => {
                chrome.storage.local.set({
                    decryptPassword: e.target[0].value
                }, r);
            });
        }
        
        document.querySelector('span').textContent = 'Updated Password!';    
    } catch(e) {
        document.querySelector('span').textContent = 'Error: ';
    } 
});

document.getElementById('gp').addEventListener('click', async () => {
    const span = document.querySelector('span');
    try {
        if(typeof browser !== 'undefined') {
            const { decryptPassword } = await browser.storage.local.get('decryptPassword');
            span.textContent = 'Your current password is: "' + decryptPassword + '"';
        } else {
            const { decryptPassword } = await new Promise(r => {
                chrome.storage.local.get('decryptPassword', r)
            });
            span.textContent = 'Your current password is: "' + decryptPassword + '"';
        }
    } catch(e)  {
        span.textContent = e.toString();
    }
});