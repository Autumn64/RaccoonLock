const { app, BrowserWindow, Notification } = require('electron');

const currentVer = 421;

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
    //win.webContents.openDevTools();
    win.removeMenu();
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
	const request = new Request("https://api.github.com/repos/Autumn64/RaccoonLock/releases/latest");
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
