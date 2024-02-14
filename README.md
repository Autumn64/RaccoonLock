# RaccoonLock
[![Pull requests](https://img.shields.io/badge/dynamic/json.svg?label=pull%20requests&style=for-the-badge&color=limegreen&url=https://codeberg.org/api/v1/repos/Autumn64/RaccoonLock&query=open_pr_counter)](https://codeberg.org/Autumn64/RaccoonLock/pulls)
[![Issues](https://img.shields.io/badge/dynamic/json.svg?label=issues&style=for-the-badge&color=red&url=https://codeberg.org/api/v1/repos/Autumn64/RaccoonLock&query=open_issues_count)](https://codeberg.org/Autumn64/RaccoonLock/issues)
[![Stars](https://img.shields.io/badge/dynamic/json.svg?label=stars&style=for-the-badge&color=yellow&url=https://codeberg.org/api/v1/repos/Autumn64/RaccoonLock&query=stars_count)](https://codeberg.org/Autumn64/RaccoonLock)
[![License](https://img.shields.io/badge/license-GPL_v3_or_later-blue?label=license&style=for-the-badge&url=)](https://codeberg.org/Autumn64/RaccoonLock/src/branch/main/LICENSE)
## A free, open-source, simple and powerful password manager.

### Description
RaccoonLock is a multi-platform password manager coded in Electron and C, made with the purpose of providing a lightweight, straightforward and secure password manager for PC users who want to store their passwords in a safe way totally offline.

### Features
- Multi-platform.
- Uses AES-256 encryption and password derivation algorithms to protect your passwords.
- Includes a powerful random password generator.

### Contribution Guidelines
#### Please note that every contribution must use the GNU GPL v3 or later.
In order to contribute, please follow these steps:
- Clone this repository.
- Make all your changes in the "prerelease" branch.
- Create a [Pull request](https://codeberg.org/Autumn64/RaccoonLock/pulls) in the "prerelease" branch. Pull requests in the "main" branch will be rejected as the purpose of that branch is to store the exact source code that is included in the binary releases.
#### Please sign your commmit, as unsigned commits will not be accepted. If you don't know how to sign a git commit, please check [this guide on how to create a GPG keypair](https://emailselfdefense.fsf.org/en/) and [this guide on how to sign a git commit with your GPG keypair](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits). Signing-off your commit would also be preferable, though it's not necessary.

### How to compile manually
- All the dependencies required for Electron are already defined in the `package.json` file, so it should work just by running `npm install` and then `npm start`.
- In order to compile RaccoonReader, you need to have OpenSSL installed on your system. Don't forget to include the `nsstring.h` and `nsstring.c` files, or, if you prefer, you can [dynamically link the library](https://codeberg.org/Autumn64/nsstring.h).

A suitable syntax for compiling RaccoonReader using gcc on GNU/Linux would be:
```bash
# On Windows, add `.exe` at the end of the filename.
gcc -o raccoonreader raccoonreader.c nsstring.c -lssl -lcrypto
```
Or, if you prefer to dynamically link the NSSTRING.H library:
```bash
# On Windows, use `nsstring.dll`
gcc -o raccoonreader raccoonreader.c -I<ROUTE TO HEADER FILE> -L<ROUTE TO .SO FILE> -lssl -lcrypto -lnsstring
```

### Extra information
Thanks so much to all of our [contributors](https://codeberg.org/Autumn64/RaccoonLock/activity/yearly).

#### All the code in this repository is licensed under the [GNU General Public License version 3 or later](./LICENSE) and the [GNU Lesser General Public License version 3 or later](./LICENSES/LICENSE-LGPLv3.txt), with some parts licensed under the [Open Font License](./LICENSES/LICENSE-OFL.txt) and some [Creative Commons licenses](./LICENSES/LICENSE-CC.txt). The resources used for the private logos and names inside the app belong to their respective Copyright holders and no infraction is intended by using them. This app is meant to be distributed for non-commercial purposes, and neither this project's owner nor its contributors are responsible for the use anyone outside of it might give to the software provided and its assets.