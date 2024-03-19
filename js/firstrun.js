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

const interfaces = require("./js/interfaces.js");
const path = interfaces.getPath();
const chp = require('child_process');
const fs = require('fs');
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () =>{
    const bienvenue = document.getElementById('bienvenue');
    const login = document.getElementById('login');

    document.documentElement.style.alignItems = 'center'; //Moves the Bienvenid@ to the center
    document.body.style.alignItems = 'center';
    bienvenue.classList.remove('hidden'); //Shows bienvenue
    bienvenue.style.animation = 'fadeinout 4s linear';
    bienvenue.addEventListener('animationend', () =>{
        bienvenue.style.display = 'none'; //Removes bienvenue
        document.documentElement.style.alignItems = 'unset'; //Removes center
        document.body.style.alignItems = 'unset';
        login.classList.remove('hidden'); //Shows login
        login.style.animation = 'fadein 1s';
        login.style.display = 'flex';
    });
});

document.getElementById('submit').addEventListener('click', () =>{ //Comenzar button
    let name = document.getElementById('name').value.trim();
    let password = document.getElementById('password').value.trim();
    let repassword = document.getElementById('repassword').value.trim();

    if (name === "" || password === "" || repassword === ""){ //There has to be something in all the inputs
        let err = document.getElementById('error');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "Enter the requested data.";
        cleanInputs();
        return;
    }

    if (password.length < 8){
        let err = document.getElementById('error');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "The password must include at least 8 characters!";
        cleanInputs();
        return;
    }

    if (password !== repassword){
        let err = document.getElementById('error');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "The password doesn't match!";
        cleanInputs();
        return;
    }

    const login = document.getElementById('login');
    login.style.animation = 'fadeout 0.5s forwards';

    const config = {
        name: name,
        language: "en"
    };
    const data = {};

    if (!fs.existsSync(`${path}`)) fs.mkdirSync(`${path}`);
    fs.writeFileSync(`${path}/config.json`, JSON.stringify(config));

    const realData = interfaces.encodeJSON(JSON.stringify(data));

    const reader = chp.spawn(interfaces.getReader(), ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${realData}\n`);
    reader.stdin.write(`${password}\n`);
    reader.stdin.write(`${password}\n`);
    reader.stdin.end();
    ipcRenderer.send('update-userinfo');

    setTimeout(() => window.location.href = 'verified.html', 1000);
});

document.getElementById('restoreacc').addEventListener('click', () => {
    ipcRenderer.send('message', "If you already have an account, please select your RaccoonLock backup file.");
    ipcRenderer.send('backup-r');
});

const cleanInputs = () =>{
    document.getElementById('password').value = "";
    document.getElementById('repassword').value = "";
}