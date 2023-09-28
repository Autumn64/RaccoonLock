# RaccoonLock
![Contributors](https://img.shields.io/github/contributors/Autumn64/RaccoonLock)
![Stars](https://img.shields.io/github/stars/Autumn64/RaccoonLock)
![License](https://img.shields.io/github/license/Autumn64/RaccoonLock)
![Issues](https://img.shields.io/github/issues/Autumn64/RaccoonLock)
## An open-source, simple, powerful and customizable password manager.

### Description
RaccoonLock is a multi-platform password manager coded in Electron, Python and C, made with the purpose of providing a lightweight, straightforward and secure password manager for PC users who want to store their passwords in a safe way, but who don't care about having them everywhere.

### Contribution Guidelines
At this moment we're not accepting contributions as we're currently rewriting large chunks of code. We'll publish appropriate contribution guidelines soon.

### Features
- Multi-platform
- Uses AES-256 encryption algorithms to protect your passwords.
- Uses a Two-Factor Authentication method.
- Includes a powerful random password generator.
- Highly customizable.

### How to compile manually
- All the dependencies required for Electron are already defined in the package-lock.json file, so it should work just by running "npm install".
- To compile RaccoonStealer, please make sure you have the OpenSSL libraries installed in your system. Compile using GCC or another compatible compiler and use flags '-lssl' and '-lcrypto'. Also make sure you have the library "nstdoi.h" that is provided along with the source code and that doesn't need flags in order to be included.
- To compile RaccoonTransfer please use GCC (if you want to use MSVC you need to install a library compatible with dirent.h). No extra flags or libraries other than "nstdoi.h" are needed.
- RaccoonUpdater only works on Windows. You need requests, subprocess, urllib, tkinter, PIL (pillow) and win32api libraries to run it. Additionally you need the "interfaces.py" module provided along with the source code. The binary provided in Windows releases is compiled with PyInstaller, not sure if it would work using other packagers.

### Extra information
Thanks so much to all of our [contributors](https://github.com/Autumn64/RaccoonLock/graphs/contributors).

#### All the code in this repository is licensed under the BSD 3-Clause license. The resources used for the app's logo and styles are Creative Commons, and the resources used for the private logos and names inside the app belong to their respective Copyright holders and no infraction is intended by using them. This app is meant to be distributed for non-commercial purposes, and neither this project's owner nor its contributors are responsible for the use anyone outside of it might give to the software provided and its assets.
