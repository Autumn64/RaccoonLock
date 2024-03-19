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

const fs = require('fs');
const chp = require('child_process');
const { ipcRenderer } = require('electron');
const interfaces = require("./js/interfaces.js");

const path = interfaces.getPath();
const langs = require("./js/lang/languages.json");

let userinfo = require(`${path}/config.json`);
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{ 
	currentlang = langs.reset[userinfo.language];
    setLang();
	verify.classList.remove('hidden');
	verify.style.display = 'flex';
	verify.style.animation = 'fadein 0.5s';
});

document.getElementById('vsubmit').addEventListener('click', () =>{
	let pass = document.getElementById('vpass').value;
	let errorv = document.getElementById('errorv');
    const reader = chp.spawn(interfaces.getReader(), ["-d", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${pass}\n`);
    reader.stdin.end();
    reader.stderr.on('data', (error) =>{
        let errorstr = error.toString();
        if (!errorstr.includes("FATAL ERROR: Couldn't finish the decryption operation! Did you enter the correct password?")){
            window.location.href = `error.html?err=${encodeURIComponent(errorstr)}`;
        }
        errorv.classList.remove('hidden');
        cleanInput();
    });

    reader.stdout.on('data', (data) =>{
        let datastr = data.toString().replace(/^RaccoonReader v[\d.]+[\s\S]+?Enter your password:/, '');

        if (datastr.trim() === "") return;

        verify.style.animation = "fadeout 0.5s forwards";
		setTimeout(() =>{
			verify.style.display = 'none';
			text.classList.remove('hidden');
			buttons.classList.remove('hidden');
			text.style.display = 'flex';
			buttons.style.display = 'flex';
			text.style.animation = 'fadein 0.5s';
			buttons.style.animation = 'fadein 0.5s';
		}, 600);
    });
});

document.getElementById('accept').addEventListener('click', () =>{
    let text = document.getElementById('text');
    let buttons = document.getElementById('buttons');
    fs.rm(path, { recursive: true, force: true }, (err) => {});
    text.style.animation = 'fadeout 1s forwards';
    buttons.style.animation ='fadeout 1s forwards';
    setTimeout(() =>{
        buttons.style.display = 'none';
        text.innerHTML = currentlang.text2;
        text.style.animation ='fadein 1s' ;
    }, 2000);
    setTimeout(() =>{
        text.style.animation = 'fadeout 1s forwards';
    }, 8000);
    setTimeout(() => ipcRenderer.send('restart'), 10000);
});

document.getElementById('cancel').addEventListener('click', () =>
    window.location.href = 'settings.html');

const cleanInput = () =>{
	document.getElementById("vpass").value = "";
}

function setLang(){
	document.getElementById('nowenter').innerHTML = currentlang.verify.nowenter;
	document.getElementById('vpass').placeholder = currentlang.verify.vpass;
	document.getElementById('errorv').innerHTML = currentlang.verify.errorv;
	document.getElementById('vsubmit').innerHTML = currentlang.verify.vsubmit;
	document.getElementById('text').innerHTML = currentlang.text;
	document.getElementById('accept').innerHTML = currentlang.buttons.accept;
	document.getElementById('cancel').innerHTML = currentlang.buttons.cancel;
}