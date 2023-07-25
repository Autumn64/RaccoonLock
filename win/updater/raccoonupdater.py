import os
import sys
import socket
import requests
import subprocess
import urllib.request
from win32api import *
from interfaces import updaterWindow

file_path: str = os.getcwd().replace('\\', '/')
url: str = "https://api.github.com/repos/Autumn64/RaccoonLock/releases/latest"
user_path: str = os.getenv('LOCALAPPDATA').replace('\\', '/')
response: dict = {}

def getCurrentVersion(file_path) -> float:
    File_information = GetFileVersionInfo(f'{file_path}/raccoonlock.exe', "\\")
    ms_file_version = File_information['FileVersionMS']
    return float(f'{HIWORD(ms_file_version)}.{LOWORD(ms_file_version)}')

def getNewVersion() -> float | int:
    global response
    try:
        response = requests.get(url).json()
        version: str = response["tag_name"].replace('v', '')
        return float(version[0:-2])
    except:
        return -1

def update() -> None:
    try:
        assets: dict = dict(response["assets"][1])
        downloadURL: str = assets["browser_download_url"]
        download_data = urllib.request.urlopen(downloadURL, timeout=10)
        f = open(f'{user_path}/RaccoonLockUpdate.exe', 'wb')
        while True:
            data = download_data.read(8192)
            if not data:
                break
            f.write(data)
        f.close()
        updater.destroyWindow()
        os.system(f'"{user_path}/RaccoonLockUpdate.exe" /silent')
        os.remove(f'{user_path}/RaccoonLockUpdate.exe')
    except:
        updater.error()
    return

def openApp() -> None:
    subprocess.call(f"{file_path}/raccoonlock.exe")
    return

if __name__ == "__main__":
    updater = updaterWindow(update)
    currentVersion: float = getCurrentVersion(file_path)
    newVersion: float | int = getNewVersion()

    if newVersion > currentVersion:
        updater.createWindow()

    openApp()
    sys.exit()