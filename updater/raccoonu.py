import os
import sys
import requests
import subprocess
import urllib.request
from win32api import *
from interfaces import updaterWindow

file_path: str = os.getcwd().replace('\\', '/')
url: str = "https://codeberg.org/api/v1/repos/Autumn64/RaccoonLock/releases/latest"
user_path: str = os.getenv('LOCALAPPDATA').replace('\\', '/')
response: dict = {}

def getCurrentVersion(file_path) -> int:
    File_information = GetFileVersionInfo(f'{file_path}/raccoonlock.exe', "\\")
    ms_file_version = File_information['FileVersionMS']
    ls_file_version = File_information['FileVersionLS']
    return int(f'{HIWORD(ms_file_version)}{LOWORD(ms_file_version)}{HIWORD(ls_file_version)}')

def getNewVersion() -> int:
    global response
    try:
        response = requests.get(url).json()
        version: str = response["tag_name"].replace('v', '').replace('.', '')
        return int(version)
    except:
        return -1

def update() -> None:
    try:
        assets: dict = response["assets"]
        for i, s in enumerate(assets):
            if s["name"] == "RaccoonLock.exe":
                info: dict = s
        downloadURL: str = info["browser_download_url"]
        download_data = urllib.request.urlopen(downloadURL, timeout=10)
        downloaded_size: int = 0
        f = open(f'{user_path}/RaccoonLockUpdate.exe', 'wb')
        while True:
            data = download_data.read(8192)
            if not data:
                break
            f.write(data)
            downloaded_size += 8192
            updater.updateBar(downloaded_size / int(download_data.headers['content-length']) * 100)

        f.close()
        updater.destroyWindow()
        subprocess.Popen([f"{user_path}/RaccoonLockUpdate.exe", "/silent"], shell=False, close_fds=True, creationflags=subprocess.DETACHED_PROCESS)
        sys.exit()
    except SystemExit:
        pass
    except:
        updater.error()
        openApp()
    return

def openApp() -> None:
    subprocess.Popen([f"{file_path}/raccoonlock.exe"], shell=False, close_fds=True, creationflags=subprocess.DETACHED_PROCESS)
    sys.exit()

if __name__ == "__main__":
    updater = updaterWindow(update)
    currentVersion: int = getCurrentVersion(file_path)
    newVersion: int = getNewVersion()

    if newVersion > currentVersion:
        updater.createWindow()
    else:
        openApp()
