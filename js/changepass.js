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

const chp = require('child_process');
const { ipcRenderer } = require('electron');
const interfaces = require("./js/interfaces.js");
const path = interfaces.getPath();
const langs = require("./js/lang/languages.json");
let userinfo = require(`${path}/config.json`);
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{ 
        currentlang = langs.changepass[userinfo.language];
        setLang();
});

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'settings.html');

document.getElementById('save').addEventListener('click', getData);

function getData(){
    let datastr = "";
    const currentpass = document.getElementById('oldpass').value;
    const newpass = document.getElementById('newpass').value;
    const reader = chp.spawn(interfaces.getReader(), ["-d", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${currentpass}\n`);
    reader.stdin.end();
    reader.stderr.on('data', (error) =>{
        if (error.includes("FATAL ERROR: Couldn't finish the decryption operation! Did you enter the correct password?")){
            ipcRenderer.send('message', currentlang.errwp);
            cleanInputs();
            return;   
        }
        window.location.href = `error.html?err=${encodeURIComponent(error)}`;
    });

    reader.stdout.on('data', (data) =>{
        datastr += data.toString().replace(/^RaccoonReader v[\d.]+[\s\S]+?Enter your password: /, '');
    });

    reader.on('close', (code) =>{
        if (datastr.trim() !== "") updatePass(datastr, newpass);
    });
}

function updatePass(data, newpass){
    if (newpass.length < 8){
        ipcRenderer.send('message', currentlang.errsp);
        cleanInputs();
        return;
    }

    if (document.getElementById('renewpass').value.trim() != newpass){
        ipcRenderer.send('message', currentlang.errdp);
        cleanInputs();
        return;
    }

    const reader = chp.spawn(interfaces.getReader(), ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${data}`); //The data already includes a '\n'
    reader.stdin.write(`${newpass}\n`);
    reader.stdin.write(`${newpass}\n`);
    reader.stdin.end();
    reader.stderr.on('data', (error) =>{
        window.location.href = `error.html?err=${encodeURIComponent(error.toString())}`;
    });

    reader.stdout.on('data', (data) =>{
        if (data.toString().includes("Data encrypted successfully!"))
            ipcRenderer.send('message', currentlang.success);
            cleanInputs();
    });
}

const cleanInputs = () =>{
    document.getElementById('oldpass').value = "";
    document.getElementById('newpass').value = "";
    document.getElementById('renewpass').value = "";
}

function setLang(){
    document.getElementById('title').innerHTML = currentlang.title;
    document.getElementById('oldpass').placeholder = currentlang.oldpass;
    document.getElementById('newpass').placeholder = currentlang.newpass;
    document.getElementById('renewpass').placeholder = currentlang.renewpass;
    document.getElementById('save').innerHTML = currentlang.save;
}