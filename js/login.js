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
const interfaces = require("./js/interfaces.js");

const path = interfaces.getPath();
const langs = require("./js/lang/languages.json");

let userinfo = require(`${path}/config.json`);
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{
	currentlang = langs.login[userinfo.language];
	setLang();
});

let passwordd = document.getElementById('passwordd');

document.getElementById('submit').addEventListener('click', () =>{
    let password = document.getElementById('password').value;
    const reader = chp.spawn(interfaces.getReader(), ["-d", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${password}\n`);
    reader.stdin.end();
    reader.stderr.on('data', (error) =>{
        let errorstr = error.toString();
        if (!errorstr.includes("FATAL ERROR: Couldn't finish the decryption operation! Did you enter the correct password?")){
            window.location.href = `error.html?err=${encodeURIComponent(errorstr)}`;
        }
        let errora = document.getElementById('errora');
        errora.classList.remove('hidden');
        errora.innerHTML = currentlang.passwordd.errora;
        cleanInput();
    });

    reader.stdout.on('data', (data) =>{
        let datastr = data.toString().replace(/^RaccoonReader v[\d.]+[\s\S]+?Enter your password:/, '');

        if (datastr.trim() === "") return;

        passwordd.style.animation = 'fadeout 1s forwards';
        setTimeout(() => {
            passwordd.style.display = 'none';
            window.location.href = 'mainmenu.html';
        }, 2000);
    });
});

const cleanInput = () =>{
    document.getElementById("password").value = "";
}

function setLang(){
    document.getElementById('bienvenue').innerHTML = currentlang.passwordd.bienvenue;
    document.getElementById('password').placeholder = currentlang.passwordd.password;
    document.getElementById('submit').innerHTML = currentlang.passwordd.submit;
}