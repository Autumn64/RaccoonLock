from cryptography.fernet import Fernet
import sys
import os


path: str = f"{os.path.expanduser('~')}/.raccoonlock"

def checkArgs() -> None:
    try:
        match sys.argv[1]:
            case "--createkey":
                createKey()
            case "--encrypt":
                encrypt()
            case "--decrypt":
                if sys.argv[2] == "--acceptdecrypt":
                    decrypt()
            case _:
                return
    except:
        sys.exit(1)

def createKey() -> None:
    key: bytes = Fernet.generate_key()
    with open(f'{path}/.key.key', 'wb') as f:
        f.write(key)

def encrypt() -> None:
    with open(f'{path}/.key.key', 'rb') as filekey:
        key = filekey.read()
    fernet = Fernet(key)
    with open(f'{path}/data.json', 'rb') as f:
        file = f.read()
    encrypted: bytes = fernet.encrypt(file)
    with open(f'{path}/data.json', 'wb') as f:
        f.write(encrypted)

def decrypt() -> None:
    with open(f'{path}/.key.key', 'rb') as filekey:
        key = filekey.read()
    fernet = Fernet(key)
    with open(f'{path}/data.json', 'rb') as f:
        encrypted = f.read()
    decrypted = fernet.decrypt(encrypted)
    with open(f'{path}/data.json', 'wb') as f:
        f.write(decrypted)

if __name__ == "__main__":
    checkArgs()
    sys.exit()