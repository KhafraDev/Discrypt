const getFingerprint = async () => {
    console.warn('Discrypt: No fingerprint found! Getting one now.');
    const ContextProperties = btoa(JSON.stringify({ 
        location: 'Login' 
    }));
    
    const res = await fetch('https://discordapp.com/api/v6/experiments', {
        headers: {
            'Accept': '*/*',
            'Accept-Language': navigator.language,
            'Content-Type': 'application/json',
            'Host': location.host,
            'User-Agent': navigator.userAgent,
            'X-Fingerprint': '',
            'X-Context-Properties': ContextProperties
        }
    });

    const { fingerprint: fp } = await res.json();
    Object.defineProperty(ls, 'fingerprint', {
        value: fp
    });

    return fp;
}

window.dispatchEvent(new Event('beforeunload')); // required, or token will be undefined!
// assigning localStorage to a variable allows us to use it in the future, and makes it impossible to remove!
// all of these variables are global to our extension, they can be accessed from index.js
const ls = window.localStorage;
/*** @type {string} 
 * * @description Discord token */
const token = JSON.parse(ls.token);
/*** @type {string} 
 * * @description Discord fingerprint */
const fingerprint = ls.fingerprint ? JSON.parse(ls.fingerprint) : getFingerprint().then(r => r);