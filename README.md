# RaccoonLock
An open-source, simple, powerful and customizable password manager.

This was originally meant to be a project for my university, but I liked it so much I decided to upload it here. I hope it can be useful for people who need a password manager!

Essentially, this software works using Electron and Python; Electron is used for all the user interface and experience along with the data (personal information and passwords) reading. Python is used to handle the encryption stuff; it creates the keys it will use to encrypt and encrypt the passwords, and it also does such operations.
Since the idea was originally to save the passwords locally (we plan on adding some sort of synchronization similar to what Anki uses in the future), it uses a JSON file to store all the passwords, making the data file lightweight and straightforward.
Additionally, it offers a 2-Factor Authenication method in order to provide an extra security layer to ensure no one has access to the users' information.
This project is not meant to be professional or commercial whatsoever; whoever wants to use this software, feel free to do so! Everyone can also modify and redistribute this software as long as this software's license terms and requirements are met. For more information, please read the LICENSE file in this repository.
