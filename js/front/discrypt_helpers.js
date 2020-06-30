/*** Discord custom header `X-Super-Properties` */
const SP = btoa({
    'os': navigator.platform,
    'browser': navigator.appCodeName,
    'device': '',
    'browser_user_agent': navigator.userAgent,
    'browser_version': navigator.userAgent.match(/(Chrome|Firefox)\/(\d+)/).pop(),
    'os_version': '10',
    'referrer': '',
    'referring_domain': '',
    'referrer_current': '',
    'referring_domain_current': '',
    'release_channel': 'stable',
    'client_build_number': Math.floor(Math.random() * (99999 - 50000 + 1) + 50000),
    'client_event_source': null
});

/**
 * Get a (grand-grand-nth)parent element that matches property.
 * @example
 *  const element = getParentLikeProp(document.querySelector('.child'), 'id', 'message-');
 *  const element = getParentLikeProp(document.querySelector('.child'), 'id', /message-\d+/);
 * @param {HTMLElement} e element
 * @param {string} prop Property
 * @param {string|RegExp} t text to match
 * @see https://jsperf.com/exec-vs-match-vs-test-vs-search/5
 * @returns {HTMLElement} parent element
 */
const getParentLikeProp = (e, prop, t) => {
    while(e = e.parentElement) {
        if(prop in e && e[prop].search(t) > -1) {
            return e;
        }
    }
}

/**
 * Returns the currently set password.
 * @returns {Promise<string>}
 */
const getPassword = () => {
    return new Promise(r => {
        chrome.runtime.sendMessage(
            { pw: true }, 
            r // callback to resolve the function
        );
    });
}