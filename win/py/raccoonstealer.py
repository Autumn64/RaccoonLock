from cryptography.fernet import Fernet
import sys
import os

path: str = os.getenv('LOCALAPPDATA').replace('\\', '/') + "/RaccoonLock"

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
                message()
    except:
        message("Not enough parameters.")

def createKey() -> None:
    key: bytes = Fernet.generate_key()
    with open(f'{path}/key.key', 'wb') as f:
        f.write(key)
    os.system(f'attrib +h "{path}/key.key"')
    os.system(f'attrib +h "{path}"')

def encrypt() -> None:
    with open(f'{path}/key.key', 'rb') as filekey:
        key = filekey.read()
    fernet = Fernet(key)
    with open(f'{path}/data.json', 'rb') as f:
        file = f.read()
    encrypted: bytes = fernet.encrypt(file)
    with open(f'{path}/data.json', 'wb') as f:
        f.write(encrypted)

def decrypt() -> None:
    with open(f'{path}/key.key', 'rb') as filekey:
        key = filekey.read()
    fernet = Fernet(key)
    with open(f'{path}/data.json', 'rb') as f:
        encrypted = f.read()
    decrypted = fernet.decrypt(encrypted)
    print(decrypted.decode())
    sys.stdout.flush()

def message(text: str = "") -> None:
    print("RaccoonStealer v3.1.0 (c) Autumn64 2023.", "Licensed by BSD-3-Clause license.", text, sep="\n")

if __name__ == "__main__":
    checkArgs()
    sys.exit()