# Discrypt
 Discord Encryption in the browser.
 Open sourced and commented, uses multiple different aspects of WebExtensions.

# Screenshots
Encrypt button 

![](assets/encrypt.png)

Decrypt button 

![](assets/decrypt.png)

Extension popup

![](assets/popup.png)

Encrypted message

![](assets/encrypted.png)

Decrypted message

![](assets/decrypted.png)

Failed to decrypt

![](assets/fail_decrypt.png)

# Credits/Licenses
* KhafraDev ("Khafra").
* DiscordJS/Amish Shah (https://github.com/discordjs/discord.js/blob/master/LICENSE)
* SJCL (https://github.com/bitwiseshiftleft/sjcl/blob/master/LICENSE.txt)
* Bootstrap SVGs (https://github.com/twbs/icons/blob/master/LICENSE.md)

# Known bugs
1. On startup you have to go to a different channel/server before buttons are added. Not really a bug since it's caused by the way I handle adding buttons.
2. Popup looks bad because I dislike HTML and CSS very much.
3. Chrome/Brave/Chromium: ```
    Error handling response: TypeError: #<Window> is not a constructor
    at resolve (<anonymous>)
    ```

# Changelog
## v1.0.0
* Initial commit.

## v1.0.1
* Better Decrypt button (looks and feels native to Discord).
* Use background script to detect page updates instead of using a keydown event.
* Use background script to change and retrieve password "safely". 
* Popup to change/get current password. 
* Better, but not great, encrypt icon.
* Completely functional, could be used on a daily basis.  

## v1.0.2
* Remove usage of ``browser`` since Firefox supports the ``chrome`` namespace. :)
* Detect if password isn't set instead of using an insecure default password.
* Password is propagated when the page loads, instead of it needing to be reset. 
* Add images to README.

## v1.0.3
* Don't alert on message send, only on failure.
* Clear the message box after sending a message.
* Better method of getting certain elements that doesn't throw errors.
* Stops password from being logged into console, after all Discord does some funky stuff with ``console``. 
* Better encrypt icon, again. Feels *almost* native, just needs to be a bit bigger.

## v1.0.4
* Less hacky way of getting token and fingerprint. Gets it from localStorage on document start instead of attaching an iframe.
* More comments!

## v1.0.5
* Fingerprint could sometimes be undefined in localStorage. Brings back the old method as a backup.
* Fix "Could not establish connection. Receiving end does not exist," by checking the status.
* Disallows encrypted messages over 2,000 characters to be sent; would cause a 401 BAD REQUEST.
* Prefix files with ``discrypt_`` to not overlap with other extensions.
* Make ``getPropertyLikeId`` more verbose; now works with any property (renamed to ``getPropertyLikeProp``).
* Remove window.onload event listener and password caching in background script.
* If a message is decrypted, press the decrypt button again to re-encrypt the contents!

## v1.0.6
* Fix a bug where the encrypt button could be added multiple times to messages that the user doesn't have access to react/edit.
* Better detection for adding the decrypt button, removes all false positives (false positives never caused issues because they were detected later).

## v1.0.7 (v1.0.7-1)
* Use MutationObserver to detect when new messages are scrolled into view or new messages are received. 
* Add decrypt buttons to all elements at once, instead of using a mouseover event.
* Fix decrypt buttons not being added to some messages (images, styled text, emojis), even though they couldn't be decrypted anyways. 
* Press the decrypt button to "re-encrypt" the message if it's decrypted. This sets the text back to its original state instead of modifying it!
* Replace `String.match` with `String.search` in some cases due to bad performance in Firefox (JSPERF: 50% slower -> 3% slower compared to indexOf).
* Better method of getting the current channel ID.
* Remove "clearing" the box after sending a message since it didn't work.
* Fingerprints stored in localStorage don't need to be parsed, and would throw an error if they were.

## v1.0.8
* Fix multi-lined messages only sending the first line.
* Get actual message length, not payload length.
* If a message is longer than 2,000 characters (Discord's max message limit) a new file will be uploaded automatically instead with the full content.
* Download and decrypt text from .txt files that are hosted on Discord (cdn.discordapp.com). Requires `https://cdn.discordapp.com/*` permission.
* Don't remove discrypt attributes from elements since there's no point in doing so. 
* Set minimum FireFox version to 74, as I use optional chaining and other syntax not valid in older versions.

## v1.0.9~beta2
* Mostly add Chrome support (throws error that's impossible to debug on URL change but it completely works).
* Organization.
* Polished the popup.