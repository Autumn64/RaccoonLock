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

    ipcMain.on('save-dialog', async (event) => {
        const options = {
          filters: [
            { name: 'RaccoonLock Container', extensions: ['rlc'] }
          ]
        };
    
        const { filePath } = await dialog.showSaveDialog(win, options);

        if (!filePath){
            event.sender.send('save-dialog-closed', null);
            return;
        }

        event.sender.send('save-dialog-closed', filePath);
    });

    ipcMain.on('open-dialog', async (event) => {
        const options ={
            filters: [
                { name: 'RaccoonLock Container', extensions: ['rlc'] }
            ]
        };

        const { filePaths } = await dialog.showOpenDialog(win, options);

        if (filePaths.length < 1){
            event.sender.send('open-dialog-closed', null);
            return;
        }
        
        event.sender.send('open-dialog-closed', filePaths[0]);
    });

    ipcMain.on('message', (event, message) =>{
        dialog.showMessageBoxSync({
            type: 'info',
            title: 'RaccoonLock',
            message: `${message}`,
            buttons: ['OK']
        });
    });

    ipcMain.on('backup-success', (event, message, path) =>{
        dialog.showMessageBoxSync({
            type: 'info',
            title: 'RaccoonLock',
            message: `${message} ${path}`,
            buttons: ['OK']
        });
    });

    ipcMain.on('backup-failure', (event, message, error) =>{
        dialog.showMessageBox({
            type: 'info',
            title: 'RaccoonLock',
            message: `${message} ${error}`,
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
		body: `RaccoonLock ${version} is now available.`,
	}).show();
}
