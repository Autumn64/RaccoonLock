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
const chp = require('child_process');
const path = interfaces.getPath();
const langs = require("./js/lang/languages.json");

let userinfo = require(`${path}/config.json`);
let currentlang;

let json;
let container = document.getElementById('container');
let neww = document.getElementById('neww');
let verify = document.getElementById('verify');
let gPassword;

window.addEventListener('DOMContentLoaded', () =>{
    currentlang = langs.addservice[userinfo.language];
    setLang();
    verify.classList.remove('hidden');
    verify.style.display = 'flex';
    verify.style.animation = 'fadein 0.5s';
    let buttons = Array.from(document.getElementsByClassName('picbtn')); //Gets all buttons
    for (let i = 0; i < buttons.length ; i++){
        buttons[i].addEventListener('click', () => checkIfExists(buttons[i].id));
    }
    other.addEventListener('click', () => createNew('')); //'Add other' button
});

document.getElementById('vsubmit').addEventListener('click', () =>{
    let pass = document.getElementById('vpass').value;
	let errorv = document.getElementById('errorv');
    let datastr = "";

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
        datastr += data.toString().replace(/^RaccoonReader v[\d.]+[\s\S]+?Enter your password: /, '');
    });

    reader.on('close', (code) =>{
        if (datastr.trim() === "") return;
        gPassword = pass;
        json = JSON.parse(interfaces.decodeJSON(datastr));

        verify.style.animation = "fadeout 0.5s forwards";
        setTimeout(() =>{
            verify.style.display = 'none';
            container.classList.remove('hidden');
            container.style.display = 'flex';
            container.style.animation = 'fadein 0.5s';
        }, 600);
    });	
});


document.getElementById('goback').addEventListener('click', () => //Go back button
    window.location.href = 'mainmenu.html');

document.getElementById('submit').addEventListener('click', addData); //Submit button

function checkIfExists(id){
    for(let key in json){
        if (id.toLowerCase() === key.toLowerCase()){ //If it exists send to modify service page
            let location = `modifyservice.html?id=${encodeURIComponent(key)}&pass=false`;
            window.location.href = location;
        }else{
            createNew(id); //Pass id
        }
    }
    if (Object.keys(json).length === 0){ //If there's no values in the json
        createNew(id);
    }
}

function createNew(id){
    let service = document.getElementById('service'); //Service input
    container.style.animation = 'fadeout 0.5s forwards';
    setTimeout(() => container.style.display = 'none', 500);
    setTimeout(() =>{
        neww.classList.remove('hidden');
        neww.style.display = 'flex';
        neww.style.animation = 'fadein 0.5s';
        service.value = id;
    }, 1000);
}

function addData(){
    let service = document.getElementById('service').value; //Service input
    let user = document.getElementById('user').value; //User input
    let password =document.getElementById('password').value; //Password input
    let error = document.getElementById('error') //Error message
    let success = document.getElementById('success') //Success message

    for(let key in json){
        if (service.toLowerCase() === key.toLowerCase()){
            error.classList.remove('hidden'); //Shows error message
            error.innerHTML = currentlang.neww.error[0];
            return;
        }
    }

    if (service.trim() === '' || user.trim() === '' || password.trim() === ''){
        error.classList.remove('hidden'); //Shows error message
        error.innerHTML = currentlang.neww.error[1];
        return;
    }
    document.getElementById("submit").style.animation = "fadeout 0.5s forwards";
    error.style.display = 'none'; //Hides error message
    
    let new_JSON = {[service]: {user: [], password: []}, ...json} //Creates new key at the beginning
    new_JSON[service].user.push(user);
    new_JSON[service].password.push(password);
	let data = interfaces.encodeJSON(JSON.stringify(new_JSON));
    document.getElementById('goback').style.display = 'none'; //Hide back button

    const reader = chp.spawn(interfaces.getReader(), ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${data}\n`);
    reader.stdin.write(`${gPassword}\n`);
    reader.stdin.write(`${gPassword}\n`);
    reader.stdin.end();

    reader.stderr.on('data', (error) =>{
        window.location.href = `error.html?err=${encodeURIComponent(error.toString())}`;
    });

    reader.stdout.on('data', (data) =>{
        if (data.toString().includes("Data encrypted successfully!"))
            success.classList.remove('hidden'); //Shows success message
            setTimeout(() =>{
                neww.style.animation = 'fadeout 0.5s forwards'; //Hide neww div
            }, 3000);
            setTimeout(() => window.location.href = 'showpass.html', 5000); //Go to showpass
    });
}

const cleanInput = () =>{
    document.getElementById('vpass').value = "";
}

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('other').innerHTML = currentlang.container.otherbtn.other;

    document.getElementById('titlenew').innerHTML = currentlang.neww.titlenew;
    document.getElementById('service').placeholder = currentlang.neww.service;
    document.getElementById('user').placeholder = currentlang.neww.user;
    document.getElementById('password').placeholder = currentlang.neww.password;
    document.getElementById('success').innerHTML = currentlang.neww.success;
    document.getElementById('submit').innerHTML = currentlang.neww.submit;
    document.getElementById('nowenter').innerHTML = currentlang.verify.nowenter;
    document.getElementById('vpass').placeholder = currentlang.verify.vpass;
    document.getElementById('errorv').innerHTML = currentlang.verify.errorv;
    document.getElementById('vsubmit').innerHTML = currentlang.verify.vsubmit;
}