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
const tar = require('tar');
const interfaces = require("./js/interfaces.js");
const path = interfaces.getPath();
const langs = require("./js/lang/languages.json");

let userinfo = require(`${path}/config.json`);
let currentlang = langs.misc[userinfo.language];

const currentVer = 500;

function createWindow(){

    const win = new BrowserWindow({
        width: 800,
        height: 600,
	    icon:'icon.png',
	    title: 'RaccoonLock',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false,
        }
    });

    ipcMain.on('backup-c', async (event) => {
        const options = {
          filters: [
            { name: 'RaccoonLock Backup File (.tar.gz)', extensions: ['tar.gz'] }
          ]
        };
    
        const { filePath } = await dialog.showSaveDialog(win, options);

        if (!filePath){
            return;
        }

        createBackup(filePath);
    });

    ipcMain.on('backup-r', async (event) => {
        const options ={
            filters: [
                { name: 'RaccoonLock Backup File (.tar.gz)', extensions: ['tar.gz'] }
            ]
        };

        const { filePaths } = await dialog.showOpenDialog(win, options);

        if (filePaths.length < 1){
            return;
        }
        
        restoreBackup(filePaths[0]);
    });

    ipcMain.on('change-lang', (event, newlang) =>{
        currentlang = langs.misc[newlang];
    });

    ipcMain.on('message', (event, message) =>{
        dialog.showMessageBoxSync({
            type: 'info',
            title: 'RaccoonLock',
            message: `${message}`,
            buttons: ['OK']
        });
    });

    ipcMain.on('restart', (event) =>{
        app.relaunch();
        app.exit(0);
    });

    win.webContents.openDevTools();
    //win.removeMenu();
    win.loadFile('index.html');
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
		body: `${currentlang.newver[0]} ${version} ${currentlang.newver[1]}`
	}).show();
}

function createBackup(filePath){
    filePath = filePath.includes(".tar.gz") ? filePath : `${filePath}.tar.gz`;

    tar.c({
        gzip: true,
        file: filePath,
        C: path
    }, [`config.json`, `data.rld`])
    .then(() => dialog.showMessageBoxSync({
        type: 'info',
        title: 'RaccoonLock',
        message: currentlang.bcsuccess,
        buttons: ['OK']
    }));
}

async function restoreBackup(filePath){
    const filenames = [];

    await tar.t({
        file: filePath,
        onentry: entry => filenames.push(entry.path)
    }).then(() =>{});

    if (!filenames.includes("config.json") || !filenames.includes("data.rld")){
        dialog.showMessageBoxSync({
            type: 'info',
            title: 'RaccoonLock',
            message: currentlang.notrlfile,
            buttons: ['OK']
        });
        return;
    }

    tar.x({
        file: filePath,
        C: path
    })
    .then(() => {
        const messages = [currentlang.brsuccess, currentlang.restart];

        for (let i = 0; i < 2; i++){
            dialog.showMessageBoxSync({
                type: 'info',
                title: 'RaccoonLock',
                message: messages[i],
                buttons: ['OK']
            });
        }

        app.relaunch();
        app.exit(0);
    });
}