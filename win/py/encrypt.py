from cryptography.fernet import Fernet

with open('C:/RaccoonLock/key.key', 'rb') as filekey:
    key = filekey.read()

fernet = Fernet(key)

with open('C:/RaccoonLock/data.json', 'rb') as f:
    file = f.read()

encrypted: bytes = fernet.encrypt(file)

with open('C:/RaccoonLock/data.json', 'wb') as f:
    f.write(encrypted)