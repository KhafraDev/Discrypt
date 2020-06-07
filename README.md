# Discrypt
 Discord Encryption in the browser

# WIP
* Changing passwords.
* Add Decrypt button when a new message appears (using a MutationObserver).

# Credits/Licenses
* KhafraDev ("Khafra").
* DiscordJS/Amish Shah (https://github.com/discordjs/discord.js/blob/master/LICENSE)
* SJCL (https://github.com/bitwiseshiftleft/sjcl/blob/master/LICENSE.txt)
* Bootstrap SVGs (https://github.com/twbs/icons/blob/master/LICENSE.md)

# Known bugs
1. Elements containing x,y,z do not work (styled text, mentions, who knows?).
    * Reactions do not cause this problem.
    * Happens with bold text, emojis/role mention. 
    * Should it work? If text is formatted, it obviously means it isn't encrypted.
2. Handle errors when an element isn't found, instead of having the browser deal with it silently, like many other extensions. 
3. On startup you have to go to a different channel/server before buttons are added. Not really a bug since it's caused by the way I handle adding buttons.
4. Probably only works on Firefox, and possibly Edge. However it's only tested on Firefox since Chrome+Edge are spyware. 

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