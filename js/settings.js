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

const { ipcRenderer } = require('electron');
const fs = require("fs");
const interfaces = require("./js/interfaces.js");

const path = interfaces.getPath();
const langs = require("./js/lang/languages.json");

let userinfo = require(`${path}/config.json`);
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{ 
        currentlang = langs.settings[userinfo.language];
        setLang();
        document.getElementById('name').value = userinfo.name;
});

document.getElementById('reset').addEventListener('click', () =>
    window.location.href = 'reset.html');

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'mainmenu.html');

document.getElementById('about').addEventListener('click', () =>
    window.location.href = 'about.html');

document.getElementById('changepasswd').addEventListener('click', () =>
    window.location.href = 'changepass.html');

document.getElementById('save').addEventListener('click', saveData);

document.getElementById('backup').addEventListener('click', () =>{
    ipcRenderer.send('backup-c');
});

document.getElementById('restore').addEventListener('click', () =>{
    ipcRenderer.send('backup-r');
});

function saveData(){
    let newName = document.getElementById('name').value.trim();
    let newLang = document.getElementById('language').value;
    if (newName === ""){
        ipcRenderer.send('message', currentlang.info.error);
        return;
    }
    userinfo.name = newName;
    userinfo.language = newLang;
    let newData = JSON.stringify(userinfo);

    fs.writeFileSync(`${path}/config.json`, newData);
    updateScreen();
}

function updateScreen(){
    currentlang = langs.settings[userinfo.language];
    setLang();
    ipcRenderer.send('message', currentlang.info.sucessa);
}

function setLang(){
    document.getElementById('about').innerHTML = currentlang.topbar.about;
    document.getElementById('title').innerHTML = currentlang.info.title;

    document.getElementById('tdname').innerHTML = currentlang.info.table.tdname;
    document.getElementById('tdlanguage').innerHTML = currentlang.info.table.tdlanguage;
    document.getElementById('name').placeholder = currentlang.info.table.name;
    document.getElementById('language').value = userinfo.language;

    document.getElementById('changepasswd').innerHTML = currentlang.info.changepasswd;
    document.getElementById('save').innerHTML = currentlang.info.save;
    document.getElementById('backup').innerHTML = currentlang.info.backup;
    document.getElementById('restore').innerHTML = currentlang.info.restore;
    document.getElementById('reset').innerHTML = currentlang.info.reset;
}