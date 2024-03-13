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
let keys = [];

const verify = document.getElementById('verify');
const container = document.getElementById('container');
const copied = document.getElementById('copied');
let theresData = true;

window.addEventListener('DOMContentLoaded', () =>{ 
    currentlang = langs.showpass[userinfo.language];
    setLang();
    verify.classList.remove('hidden');
    verify.style.display = 'flex';
    verify.style.animation = 'fadein 0.5s';
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

        json = JSON.parse(interfaces.decodeJSON(datastr));
        for (let key in json){
            keys.push(key);
        }
        verify.style.animation = "fadeout 0.5s forwards";
        setTimeout(() =>{
            verify.style.display = 'none';
            container.classList.remove('hidden');
            container.style.display = 'flex';
            container.style.animation = 'fadein 0.5s';
            setData();
        }, 600);
    });
});

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'mainmenu.html');

document.getElementById('search').addEventListener('input', function (){
    let tablediv = document.getElementById('tablediv');
    tablediv.innerHTML = "";
    if (this.value.trim() === ""){
        setData();
    }else{
        searchData(this);
    }
});

const clearAllTimeouts = () =>{
    let highestTimeoutId = setTimeout(() =>{});
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i); 
    }
}

function searchData(search){
    let found = [];
    if (keys.length === 0){
        container.innerHTML += `${currentlang.container.nodata}.`;
        theresData = false;
    }
    if (theresData === true){
        keys.forEach(key =>{
            if (key.toLowerCase().includes(search.value.toLowerCase())) found.push(key);
        });
        found.sort();
        found.forEach(showData);
        addClick();
    }
}

function setData(){
    if (keys.length === 0){
        container.innerHTML += `${currentlang.container.nodata}.`;
        theresData = false;
    }
    if (theresData === true){
        keys.forEach(showData);
        addClick();
    }
}

function showData(key){ //Iterates for each service
    let table = document.createElement('table');
    let tablediv = document.getElementById('tablediv');
    table.className = 'stuff';
    tablediv.innerHTML += `<h2><u>${key}</u></h2>`; //Specifies the service
    for (let i = 0; i < json[key].user.length; i++){ //For each item in the "user" array
        let rowUser = table.insertRow();
        let cell1User = rowUser.insertCell();
        cell1User.innerHTML = currentlang.container.table.user;
        let cell2User = rowUser.insertCell();
        cell2User.innerHTML = `<input type="email" value="${json[key].user[i]}" class="data" tabindex="1" readonly>`;

        let rowPass = table.insertRow();
        let cell1Pass = rowPass.insertCell();
        cell1Pass.innerHTML = currentlang.container.table.password;
        let cell2Pass = rowPass.insertCell();
        cell2Pass.innerHTML = `<input type="password" value="${json[key].password[i]}" class="data" tabindex="1" readonly>`; //Password array works the same way
        // Add two empty rows after password row
        let emptyRow1 = table.insertRow();
        let emptyCell1 = emptyRow1.insertCell();
        emptyCell1.innerHTML = "<br>";
        let emptyRow2 = table.insertRow();
        let emptyCell2 = emptyRow2.insertCell();
        emptyCell2.innerHTML = "<br>";
    }
    tablediv.appendChild(table);
}

function addClick(){
    let allinps = Array.from(document.getElementsByClassName('data'));
    for(let i = 0; i < allinps.length; i++){
        allinps[i].addEventListener('click', () => {
		allinps[i].type = "text";
		copy(allinps[i].value)
	});
        allinps[i].addEventListener('keypress', event => {
		if(event.key === 'Enter'){
			allinps[i].type = "text";
			copy(allinps[i].value);
		}
	});
    }
}

function copy(text){
    clearAllTimeouts();
    navigator.clipboard.writeText(text);
    copied.classList.remove('hidden');
    copied.style.display = '';
    copied.style.animation = 'fadein 0.2s';
    setTimeout(() =>{
        copied.style.animation = 'fadeout 0.2s forwards';
    }, 3000);
    setTimeout(() => copied.style.display = 'none', 4000);
}

const cleanInput = () =>{
    document.getElementById('vpass').value = "";
}

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('search').placeholder = currentlang.container.search;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
    document.getElementById('nowenter').innerHTML = currentlang.verify.nowenter;
    document.getElementById('vpass').placeholder = currentlang.verify.vpass;
    document.getElementById('errorv').innerHTML = currentlang.verify.errorv;
    document.getElementById('vsubmit').innerHTML = currentlang.verify.vsubmit;
}