import os
import sys
import subprocess
from urllib.parse import quote
from cryptography.fernet import Fernet

stealer: str
path: str

def error(err: str) -> None:
    print(f"{err}!", file=sys.stderr)
    sys.exit(0)

def decrypt() -> str:
    try:
        with open(f'{path}/key.key', 'rb') as filekey:
            key = filekey.read()
        fernet = Fernet(key)
        with open(f'{path}/data.json', 'rb') as f:
            encrypted = f.read()
        decrypted: str = fernet.decrypt(encrypted).decode()
        decrypted = quote(decrypted)
    except Exception as e:
        error(e)
    return decrypted

def readNotEncrypted() -> str:
    try:
        with open(f'{path}/info.json', 'r') as f:
            notEncrypted: str = f.read()
            notEncrypted = quote(notEncrypted)
    except Exception as e:
        error(e)
    return notEncrypted

if __name__ == "__main__":
    if sys.platform == "win32":
        path = os.getenv('LOCALAPPDATA').replace('\\', '/') + "/RaccoonLock"
        stealer = "raccoonstealer.exe"

    elif sys.platform == "linux":
        path = f"{os.path.expanduser('~')}/.raccoonlock"
        stealer = "/usr/share/raccoonlock/raccoonstealer"
    
    decrypted: str = decrypt()
    notEncrypted: str = readNotEncrypted()
    subprocess.call(f'{stealer} -c -y "{path}/data.rlc"', shell=True)
    print("")
    subprocess.call(f'{stealer} -a "{path}/data.rlc" "{decrypted}" "{notEncrypted}"', shell=True)
    os.remove(f"{path}/key.key")
    os.remove(f"{path}/data.json")
    os.remove(f"{path}/info.json")
    print("\nWelcome to RaccoonLock 4.0! Please close this window and restart the app.")
    input("Press Enter to continue...")
    sys.exit(0)
