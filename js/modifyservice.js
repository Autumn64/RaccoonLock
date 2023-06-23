const fs = require('fs');
var exec = require('child_process').execFile;

var json;
var keys = [];
var user; //User
var container = document.getElementById('container'); //Container
var services = document.getElementById('services'); //Combobox
var datas = document.getElementById('datas'); //Datas div
var modify = document.getElementById('modify'); //Modify div

window.addEventListener('DOMContentLoaded', () =>{
    exec('decrypt.exe', ['--acceptdecrypt'], (error, data) => {setTimeout(getData, 1000);});
});

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'mainmenu.html');

services.addEventListener('change', () =>{ //When user selects a value from the combobox
    showAll();
});

document.getElementById('save').addEventListener('click', () =>{ //Save button
    var change;
    var key = services.value; //Gets current key
    var index = user; //Gets current index
    var tmpuser = document.getElementById('user').value; //New values
    var tmppassword = document.getElementById('password').value;
    if(tmpuser !== json[key].user[index] || tmppassword !== json[key].password[index]){
            change = true;
    }
    if(tmpuser.trim() === "" || tmppassword.trim() === ""){
        var err = document.getElementById('error');
        err.classList.remove('hidden');
        err.innerHTML = "Enter the requested data.<br><br>";
        change = false;
    }
    if(change === true){
        updateJSON(key, index, tmpuser, tmppassword);
        setTimeout(() =>{
            document.getElementById('error').style.display = 'none';
            document.getElementById('success').classList.remove('hidden'); //Shows success message
            document.getElementById('goback').style.display = 'none'; //Hide back button
        }, 300);
        setTimeout(() => 
        window.location.href = `modifyservice.html?id=${services.value.replace(' ', '%20')}`, 3000);
    }
});

document.getElementById('cancel').addEventListener('click', () => //Cancel button
    window.location.href = `modifyservice.html?id=${services.value.replace(' ', '%20')}` //Keep the value
);

document.getElementById('delete').addEventListener('click', () =>{ //Delete link
    var confirm = document.getElementById('confirm');
    container.style.animation = 'fadeout 0.5 forwards';
    container.style.display = 'none';
    modify.style.animation = 'fadeout 0.5 forwards';
    modify.style.display = 'none';
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
    window.location.href = `modifyservice.html?id=${services.value.replace(' ', '%20')}`
);

document.getElementById('savea').addEventListener('click', () => //Save button from add screen
    addData()
);

document.getElementById('cancela').addEventListener('click', () => //Cancel button from add screen
    window.location.href = `modifyservice.html?id=${services.value.replace(' ', '%20')}`
);


function showAll(){
    var selected = services.value;
    if (selected === 'none'){
        datas.style.display = 'none';
    }else{
        datas.style.display = 'flex';
        showData(selected);
    }
}

function getData(){
    var parameters = new URLSearchParams(document.location.search);
    json = JSON.parse(fs.readFileSync('C:/RaccoonLock/data.json', 'utf8'));
    exec('encrypt.exe', (error, data) => {});
    for (var key in json){
        if(key === 'RaccoonLock') continue; //Ignores the app's password
        keys.push(key);
    }
    keys.forEach((key) =>{
        var option = document.createElement('option');
        option.value, option.innerHTML = key; //Both value and inner HTML will be the key
        services.appendChild(option);
    });
    services.value = parameters.get('id').replace('%20', ' ');
    showAll(); //Shows the data if something is selected when page loads
}

function showData(key){
    var table = document.createElement('table');
    table.className = 'stuff';
    for(let i = 0; i < json[key].user.length; i++){
        let rowUser = table.insertRow();
        let cell1User = rowUser.insertCell();
        cell1User.innerHTML = "User: ";
        let cell2User = rowUser.insertCell();
        cell2User.innerHTML = `<div class="data" id="${i}">${json[key].user[i]}</div>`;

        let rowPass = table.insertRow();
        let cell1Pass = rowPass.insertCell();
        cell1Pass.innerHTML = "Password: ";
        let cell2Pass = rowPass.insertCell();
        cell2Pass.innerHTML = `<div class="data" id="${i}">${json[key].password[i]}</div><br><br>`; //Password array works the same way
        // Add two empty rows after password row
        let emptyRow1 = table.insertRow();
        let emptyCell1 = emptyRow1.insertCell();
        emptyCell1.innerHTML = "<br>";
        let emptyRow2 = table.insertRow();
        let emptyCell2 = emptyRow2.insertCell();
        emptyCell2.innerHTML = "<br>";
    }
    datas.replaceChildren(table);
    var alldivs = Array.from(document.getElementsByClassName('data'));
    for(let i = 0; i < alldivs.length; i++){
        alldivs[i].addEventListener('click', () => {
            modifyData(services.value, alldivs[i].id); //Passes the service selected and the index of the array
            user = alldivs[i].id; //Update user index
        });
    }
    var add = document.createElement('button');
    add.id = 'add';
    add.innerHTML = 'Add account';
    datas.appendChild(add);
    document.getElementById('add').addEventListener('click', () =>{ //Add button
        var addd = document.getElementById('addd');
        container.style.animation = 'fadeout 0.5s forwards'; //Hides container
        setTimeout(()=> {
            container.style.display = 'none';
            addd.style.animation = 'fadein 0.5s'; //Shows addd div
            addd.style.display = 'flex';
        }, 1000);
    });
}

function modifyData(key, index){
    var user = document.getElementById('user');
    var password = document.getElementById('password');
    
    services.style.animation = 'fadeout 0.5s forwards';
    services.style.display = 'none'; //Removes services combobox
    datas.style.animation = 'fadeout 0.5s forwards';
    datas.style.display = 'none'; //Removes datas div
    modify.classList.remove('hidden');
    modify.style.display = 'flex'; //Shows modify div
    modify.style.animation = 'fadein 0.5s';
    user.value = json[key].user[index];
    password.value = json[key].password[index];
}

function updateJSON(key, index, user, pass){
    json[key].user[index] = user;
    json[key].password[index] = pass;
    var newJSON = JSON.stringify(json);
    fs.writeFileSync("C:/RaccoonLock/data.json", newJSON, (err) => {});
    exec('encrypt.exe', (err, data) =>{});
}

function deleteData(){
    var successb = document.getElementById('successb'); //Success message
    var user = document.getElementById('user').value; //Gets current user value
    var key = services.value; //Gets current key
    var index = json[key].user.indexOf(user); //Gets current index

    json[key].user.splice(index, 1); //Remove the index
    json[key].password.splice(index, 1);

    if (json[key].user.length === 0){ //If there's no accounts remove the service
        delete json[key];
    }
    var newJSON = JSON.stringify(json);
    fs.writeFileSync("C:/RaccoonLock/data.json", newJSON, (err) => {});
    exec('encrypt.exe', (err, data) =>{});
    setTimeout(() => {
        successb.classList.remove('hidden');
        document.getElementById('goback').style.display = 'none'; //Hide back button
    }, 300)
    setTimeout(() =>
    window.location.href = 'modifyservice.html?id=none', 3000);
}

function addData(){
    var key = services.value; //Gets current key
    var usera = document.getElementById('usera').value; //User
    var passworda = document.getElementById('passworda').value; //Password
    var errora = document.getElementById('errora'); //Error message from add screen

    if (usera.trim() !== "" && passworda.trim()){
        json[key].user.push(usera.trimStart());
        json[key].password.push(passworda.trimStart());
        var newJSON = JSON.stringify(json);
        fs.writeFileSync("C:/RaccoonLock/data.json", newJSON, (err) => {});
        exec('encrypt.exe', (err, data) =>{});
        setTimeout(() =>{
            errora.style.display = 'none'; //Hides error message if there's one
            successa.classList.remove('hidden');
            document.getElementById('goback').style.display = 'none'; //Hide back button
        }, 300);
        setTimeout(() =>
        window.location.href = `modifyservice.html?id=${services.value.replace(' ', '%20')}`, 3000);
    }else{
        errora.classList.remove('hidden');
        errora.innerHTML = "Enter the requested data.<br><br>";
    }
}