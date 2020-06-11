document.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault(); // so form doesn't reset
    if(!e.target[0].value.length) {
        return;
    }

    try {
        await new Promise(r => chrome.storage.local.set({
            decryptPassword: e.target[0].value
        }, r));
        
        document.querySelector('span').textContent = 'Updated Password!';    
    } catch(e) {
        document.querySelector('span').textContent = 'Error: ' + e.toString();
    } 
});

document.getElementById('gp').addEventListener('click', async () => {
    const span = document.querySelector('span');
    try {
        const { decryptPassword } = await new Promise(r => chrome.storage.local.get('decryptPassword', r));
        span.textContent = decryptPassword ? 'Your current password is: "' + decryptPassword + '"!' : 'No password set!';
    } catch(e)  {
        span.textContent = e.toString();
    }
});