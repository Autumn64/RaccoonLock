/*
Copyright (c) 2023-2024, Mónica Gómez (Autumn64)

RaccoonLock is free software: you can redistribute it and/or modify it 
under the terms of the GNU General Public License as published by 
the Free Software Foundation, either version 3 of the License, or 
(at your option) any later version.

RaccoonLock is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
General Public License for more details.

You should have received a copy of the GNU General Public License 
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

const { app, BrowserWindow, Notification, ipcMain, dialog} = require('electron');
const fs = require("fs");

const currentVer = 500;
const path = getPath();

function createWindow(){
    const splash = new BrowserWindow({
        width: 450,
        height: 250,
        icon:'icon.png',
        transparent: true,
        frame: false,
        resizable: false
    });

    const win = new BrowserWindow({
        width: 800,
        height: 600,
	    icon:'icon.png',
	    title: 'RaccoonLock',
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false,
        }
    });

    splash.loadFile('splash.html');
    splash.center();
    loadData(splash, win);
}

app.whenReady().then(() =>{
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    checkUpdates();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

function checkUpdates(){
	const request = new Request("https://codeberg.org/api/v1/repos/Autumn64/RaccoonLock/releases/latest");
	fetch(request)
	.then(response =>{
		if (response.status === 200) return response.json();
	})
	.then(json =>{
		let ver = json.tag_name;
		let newVer = Number(ver.replace('v', '').replaceAll('.', ''));
		if (newVer > currentVer) newUpdate(ver);
	})
	.catch(error => {});
}

const newUpdate = (version) =>{
	new Notification({
		title: "RaccoonLock",
		body: `RaccoonLock ${version} is now available.`,
	}).show();
}

function getPath(){
    if (process.platform === "win32"){
        let path = `${process.env.LOCALAPPDATA}\\Raccoonlock`;
        return path;
    }else{
        const os = require("os");
        let path = `${os.homedir()}/.raccoonlock`;
        return path;
    }
}

function loadData(splash, win){
    setTimeout(() =>{
        splash.close();
        if(fs.existsSync(`${path}/data.rlc`)){
            win.loadFile('newversion.html');
        }else{
            win.loadFile('index.html');
        }
        //win.webContents.openDevTools();
        win.removeMenu();
        win.center();
        win.show();
    }, 2000);
}
