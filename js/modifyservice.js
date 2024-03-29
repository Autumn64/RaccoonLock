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
let user; //User
let container = document.getElementById('container'); //Container
let services = document.getElementById('services'); //Combobox
let datas = document.getElementById('datas'); //Datas div
let modify = document.getElementById('modify'); //Modify div
let verify = document.getElementById('verify');
let parameters = new URLSearchParams(document.location.search);
let gPassword;

window.addEventListener('DOMContentLoaded', () =>{
    currentlang = langs.modifyservice[userinfo.language];
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
        document.getElementById("vpass").value = "";
    });

    reader.stdout.on('data', (data) =>{
        datastr += data.toString().replace(/^RaccoonReader v[\d.]+[\s\S]+?Enter your password: /, '');
    });

    reader.on('close', (code) =>{
        if (datastr.trim() === "") return;
        gPassword = pass;
        json = JSON.parse(interfaces.decodeJSON(datastr));

        for (let key in json){
            keys.push(key);
        }

        keys.forEach((key) =>{
            let option = document.createElement('option');
            option.value, option.innerHTML = key; //Both value and inner HTML will be the key
            services.appendChild(option);
        });
        services.value = decodeURIComponent(parameters.get('id'));
        showAll();
        verify.style.animation = "fadeout 0.5s forwards";
        setTimeout(() =>{
            verify.style.display = 'none';
            container.classList.remove('hidden');
            container.style.display = 'flex';
            container.style.animation = 'fadein 0.5s';
        }, 600);
    });
});

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'mainmenu.html');

services.addEventListener('change', () =>{ //When user selects a value from the combobox
    showAll();
});

document.getElementById('save').addEventListener('click', save);

document.getElementById('cancel').addEventListener('click', () => //Cancel button
    window.location.href = `modifyservice.html?id=${encodeURIComponent(services.value)}&pass=false` //Keep the value
);

document.getElementById('delete').addEventListener('click', () =>{ //Delete link
    let confirm = document.getElementById('confirm');
    container.style.animation = 'fadeout 0.5s forwards';
    setTimeout(() => {
        container.style.display = 'none';
    }, 600);
    setTimeout(() =>{
        confirm.classList.remove('hidden');
        confirm.style.display = 'flex';
        confirm.style.animation = 'fadein 0.5s';
    }, 1000);
});

document.getElementById('accept').addEventListener('click', () => //Accept button from elimination screen
    deleteData()
);

document.getElementById('cancelb').addEventListener('click', () => //Cancel button from elimination screen
    window.location.href = `modifyservice.html?id=${encodeURIComponent(services.value)}&pass=false`
);

document.getElementById('savea').addEventListener('click', () => //Save button from add screen
    addData()
);

document.getElementById('cancela').addEventListener('click', () => //Cancel button from add screen
    window.location.href = `modifyservice.html?id=${encodeURIComponent(services.value)}&pass=false`
);

function showAll(){
    let selected = services.value;
    if (selected === 'none'){
        datas.style.display = 'none';
    }else{
        datas.style.display = 'flex';
        showData(selected);
    }
}

function showData(key){
    let table = document.createElement('table');
    table.className = 'stuff';
    for(let i = 0; i < json[key].user.length; i++){
        let rowUser = table.insertRow();
        let cell1User = rowUser.insertCell();
        cell1User.innerHTML = currentlang.container.datas.table.user;
        let cell2User = rowUser.insertCell();
        cell2User.innerHTML = `<div class="data" id="${i}" tabindex="1">${json[key].user[i]}</div>`;
        let rowPass = table.insertRow();
        let cell1Pass = rowPass.insertCell();
        cell1Pass.innerHTML = currentlang.container.datas.table.password;
        let cell2Pass = rowPass.insertCell();
        cell2Pass.innerHTML = `<div class="data" id="${i}" tabindex="1">${json[key].password[i]}</div><br><br>`; //Password array works the same way
        // Add two empty rows after password row
        let emptyRow1 = table.insertRow();
        let emptyCell1 = emptyRow1.insertCell();
        emptyCell1.innerHTML = "<br>";
        let emptyRow2 = table.insertRow();
        let emptyCell2 = emptyRow2.insertCell();
        emptyCell2.innerHTML = "<br>";
    }
    datas.replaceChildren(table);
    let alldivs = Array.from(document.getElementsByClassName('data'));
    for(let i = 0; i < alldivs.length; i++){
        alldivs[i].addEventListener('click', () => {
            modifyData(services.value, alldivs[i].id); //Passes the service selected and the index of the array
            user = alldivs[i].id; //Update user index
        }
        );
        alldivs[i].addEventListener('keypress', event => {
            if (event.key === 'Enter'){
                modifyData(services.value, alldivs[i].id);
                user = alldivs[i].id;
            }
        }
        );
    }
    let add = document.createElement('button');
    add.id = 'add';
    add.innerHTML = currentlang.container.datas.add;
    datas.appendChild(add);
    document.getElementById('add').addEventListener('click', () =>{ //Add button
        let addd = document.getElementById('addd');
        container.style.animation = 'fadeout 0.5s forwards'; //Hides container
        setTimeout(()=> {
            container.style.display = 'none';
            addd.style.animation = 'fadein 0.5s'; //Shows addd div
            addd.style.display = 'flex';
        }, 1000);
    });
}

function modifyData(key, index){
    let service = document.getElementById('service');
    let user = document.getElementById('user');
    let password = document.getElementById('password');
    services.style.animation = 'fadeout 0.5s forwards';
    services.style.display = 'none'; //Removes services combobox
    datas.style.animation = 'fadeout 0.5s forwards';
    datas.style.display = 'none'; //Removes datas div
    modify.classList.remove('hidden');
    modify.style.display = 'flex'; //Shows modify div
    modify.style.animation = 'fadein 0.5s';
    service.value = key;
    user.value = json[key].user[index];
    password.value = json[key].password[index];
}

function save(){ //Save button
    let change;
    let key = services.value; //Gets current key
    let index = user; //Gets current index
    let tmpservice = document.getElementById('service').value; //New values
    let tmpuser = document.getElementById('user').value; 
    let tmppassword = document.getElementById('password').value;
    let err = document.getElementById('error');
    if(tmpservice.toLowerCase() !== key.toLowerCase() || tmpuser !== json[key].user[index] || tmppassword !== json[key].password[index]){
        change = true;
    }
    if(tmpservice.trim() === "" || tmpuser.trim() === "" || tmppassword.trim() === ""){
        err.classList.remove('hidden');
        err.innerHTML = `${currentlang.container.modify.error[1]}<br><br>`;
        change = false;
    }
    keys.forEach((item) => {
        if (tmpservice.toLowerCase() === item.toLowerCase() && tmpservice.toLowerCase() !== key.toLowerCase()){
            err.classList.remove('hidden');
            err.innerHTML = `${currentlang.container.modify.error[0]}<br><br>`;
            change = false;
        }
    });
    if(change === true){
        updateJSON({
            key: key, 
            index: index, 
            service: tmpservice, 
            user: tmpuser, 
            pass: tmppassword
        });
        setTimeout(() =>{
            document.getElementById('error').style.display = 'none';
            document.getElementById('success').classList.remove('hidden'); //Shows success message
            document.getElementById('goback').style.animation = 'fadeout 0.5s forwards'; //Hide back button
            document.getElementById('save').style.animation = 'fadeout 0.5s forwards';
            document.getElementById('cancel').style.animation = 'fadeout 0.5s forwards';
            document.getElementById('delete').style.animation = 'fadeout 0.5s forwards';
        }, 300);
        hideDiv('title');
        hideDiv('modify');
        setTimeout(() => 
        window.location.href = `modifyservice.html?id=${encodeURIComponent(tmpservice)}&pass=false`, 3000);
    }
}

function updateJSON({ key, index, service, user, pass }){
    if (key.toLowerCase() !== service.toLowerCase()){
        Object.defineProperty(json, service,
            Object.getOwnPropertyDescriptor(json, key));
        delete json[key];
        key = service;
        json = {[key]: {user: json[key].user, password: json[key].password}, ...json};
    }
    json[key].user[index] = user;
    json[key].password[index] = pass;
    let newJSON = interfaces.encodeJSON(JSON.stringify(json));
    saveAll(newJSON);
}

function deleteData(){
    let successb = document.getElementById('successb'); //Success message
    let user = document.getElementById('user').value; //Gets current user value
    let key = services.value; //Gets current key
    let index = json[key].user.indexOf(user); //Gets current index
    json[key].user.splice(index, 1); //Remove the index
    json[key].password.splice(index, 1);
    if (json[key].user.length === 0){ //If there's no accounts remove the service
        delete json[key];
    }
    
    let newJSON = interfaces.encodeJSON(JSON.stringify(json));
    saveAll(newJSON);
    setTimeout(() => {
        successb.classList.remove('hidden');
        document.getElementById('goback').style.animation = 'fadeout 0.5s forwards'; //Hide back button
        document.getElementById('accept').style.animation = 'fadeout 0.5s forwards';
        document.getElementById('cancelb').style.animation = 'fadeout 0.5s forwards';
    }, 300);
    hideDiv('confirm');
    setTimeout(() =>
    window.location.href = 'showpass.html', 3000);
}

function addData(){
    let key = services.value; //Gets current key
    let usera = document.getElementById('usera').value; //User
    let passworda = document.getElementById('passworda').value; //Password
    let errora = document.getElementById('errora'); //Error message from add screen

    if (usera.trim() !== "" && passworda.trim() !== ""){
        json[key].user.push(usera.trimStart());
        json[key].password.push(passworda.trimStart());
	    
    	let newJSON = interfaces.encodeJSON(JSON.stringify(json));
    	saveAll(newJSON);
        setTimeout(() =>{
            errora.style.display = 'none'; //Hides error message if there's one
            successa.classList.remove('hidden');
            document.getElementById('goback').style.animation = 'fadeout 0.5s forwards'; //Hide back button
            document.getElementById('savea').style.animation = 'fadeout 0.5s forwards';
            document.getElementById('cancela').style.animation = 'fadeout 0.5s forwards';
        }, 300);
        hideDiv('addd');
        setTimeout(() =>
        window.location.href = `modifyservice.html?id=${encodeURIComponent(services.value)}&pass=false`, 3000);
    }else{
        errora.classList.remove('hidden');
        errora.innerHTML = currentlang.addd.errora;
    }
}

const hideDiv = (div) =>{
    setTimeout(() =>{
        document.getElementById(div).style.animation = 'fadeout 0.5s forwards'; //Hide all
    }, 2500);
}

function saveAll(jsondata){
    const reader = chp.spawn(interfaces.getReader(), ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${jsondata}\n`);
    reader.stdin.write(`${gPassword}\n`);
    reader.stdin.write(`${gPassword}\n`);
    reader.stdin.end();
    reader.stderr.on('data', (error) =>{
        window.location.href = `error.html?err=${encodeURIComponent(error.toString())}`;
    });
}

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('services').options[0].innerHTML = currentlang.container.select.none;
    document.getElementById('user').placeholder = currentlang.container.modify.user;
    document.getElementById('password').placeholder = currentlang.container.modify.password;
    document.getElementById('success').innerHTML = currentlang.container.modify.success;
    document.getElementById('save').innerHTML = currentlang.container.modify.buttons.save;
    document.getElementById('cancel').innerHTML = currentlang.container.modify.buttons.cancel;
    document.getElementById('delete').innerHTML = currentlang.container.modify.delete;
    document.getElementById('text').innerHTML = currentlang.confirm.text;
    document.getElementById('successb').innerHTML = currentlang.confirm.successb;
    document.getElementById('accept').innerHTML = currentlang.confirm.buttons.accept;
    document.getElementById('cancelb').innerHTML = currentlang.confirm.buttons.cancelb;
    document.getElementById('titleadd').innerHTML = currentlang.addd.titleadd;
    document.getElementById('usera').placeholder = currentlang.addd.usera;
    document.getElementById('passworda').placeholder = currentlang.addd.passworda;
    document.getElementById('successa').innerHTML = currentlang.addd.successa;
    document.getElementById('savea').innerHTML = currentlang.addd.buttons.savea;
    document.getElementById('cancela').innerHTML = currentlang.addd.buttons.cancela;
    document.getElementById('nowenter').innerHTML = currentlang.verify.nowenter;
    document.getElementById('vpass').placeholder = currentlang.verify.vpass;
    document.getElementById('errorv').innerHTML = currentlang.verify.errorv;
    document.getElementById('vsubmit').innerHTML = currentlang.verify.vsubmit;
}