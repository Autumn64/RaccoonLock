import os
from cryptography.fernet import Fernet

key: bytes = Fernet.generate_key()

with open('C:/RaccoonLock/key.key', 'wb') as f:
    f.write(key)

os.system("attrib +h C:/RaccoonLock/key.key")
os.system("attrib +h C:/RaccoonLock")