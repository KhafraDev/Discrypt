const log = message => document.querySelector('.log').textContent = message;
let interval;

document.querySelector('#update-button').addEventListener('click', () => {
    try {
        chrome.storage.local.set(
            { decryptPassword: document.querySelector('.password-update input').value }, 
            () => log('Updated Password!')
        );
    } catch(e) {
        log('Error: ' + e.toString());
    } finally {
        clearInterval(interval);
        interval = setTimeout(log, 5000, '');
    }
});

document.getElementById('gp').addEventListener('click', () => {
    try {
        chrome.storage.local.get(
            'decryptPassword', 
            ({ decryptPassword }) => log(decryptPassword ? 'Your current password is: "' + decryptPassword + '"!' : 'No password set!')
        );
    } catch(e)  {
        log('Error: ' + e.toString());
    } finally {
        clearInterval(interval);
        interval = setTimeout(log, 5000, '');
    }
});