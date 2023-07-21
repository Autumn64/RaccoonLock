import os
import sys
import json
import time
import shutil

path: str = os.getenv('LOCALAPPDATA').replace('\\', '/') + "/RaccoonLock"
info: dict

def moveFolder() -> None:
    if os.path.exists('C:/RaccoonLock'):
        print("Updating RacoonLock Folder...")
        time.sleep(3)
        os.remove('C:/RaccoonLock/styles.css')
        os.remove('C:/RaccoonLock/otherstyles.css')
        os.remove('C:/RaccoonLock/Raleway-SemiBold.ttf')
        shutil.copytree('C:/RaccoonLock', path)
        shutil.rmtree('C:/RaccoonLock')
    else:
        print("RaccoonLock folder does not exist! Exiting...")
        time.sleep(1)
        input("Press enter to exit...")
        sys.exit()
    return

def updateInfo() -> None:
    print("Updating settings file...")
    time.sleep(3)
    try:
        with open(f"{path}/info.json", 'r+') as f:
            info = json.load(f)
        if not 'language' in info.keys():
            info["language"] = "en"
            with open(f"{path}/info.json", 'w') as f:
                json.dump(info, f)
    except:
        print("There is no settings file! Aborting...")
        time.sleep(2)
        input("Press enter to exit...")
        sys.exit()
    return

if __name__ == "__main__":
    print("****** Raccoon v2 to v3 fixer ******")
    print("Made by Aurora Giselle Flores Gomez (Autumn64)\n")
    print("Fixing data...")
    time.sleep(3)
    moveFolder()
    updateInfo()
    print("Data fixed successfully! You may now upgrade to RaccoonLock v3.0.0")
    input("Press enter to exit...")
    sys.exit()