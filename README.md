# Discrypt
 Discord Encryption in the browser

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
2. Probably only works on Firefox, and possibly Edge. However it's only tested on Firefox since Chrome+Edge are spyware. 
3. Emojis are completely removed from the text.

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