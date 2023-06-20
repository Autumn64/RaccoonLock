const fs = require('fs');
var exec = require('child_process').execFile;

var json;
var container = document.getElementById('container');
var neww = document.getElementById('neww');

window.addEventListener('DOMContentLoaded', () =>{
    exec('decrypt.exe', ['--acceptdecrypt'], (error, data) => {setTimeout(readInfo, 1000);});
});

document.getElementById('goback').addEventListener('click', () => //Go back button
    window.location.href = 'mainmenu.html');

document.getElementById('submit').addEventListener('click', addData); //Submit button

function readInfo(){
    var other = document.getElementById('other');
    json = JSON.parse(fs.readFileSync('C:/UVMC/data.json', 'utf8'));
    exec('encrypt.exe', (error, data) => {});
    container.classList.remove('hidden');
    container.style.display = 'flex';
    container.style.animation = 'fadein 0.5s';
    var buttons = Array.from(document.getElementsByClassName('picbtn')); //Gets all buttons
    for (let i = 0; i < buttons.length ; i++){
        buttons[i].addEventListener('click', () => checkIfExists(buttons[i].id));
    }
    other.addEventListener('click', () => createNew('')); //'Add other' button
}

function checkIfExists(id){
    for(var key in json){
        if (id.toLowerCase() === key.toLowerCase()){ //If it exists send to modify service page
            window.location.href = `modifyservice.html?id=${key.replace(' ', '%20')}`;
        }else{
            createNew(id); //Pass id
        }
    }
    if (Object.keys(json).length === 0){ //If there's no values in the json
        createNew(id);
    }
}

function createNew(id){
    var service = document.getElementById('service'); //Service input
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
    var service = document.getElementById('service').value; //Service input
    var user = document.getElementById('user').value; //User input
    var password =document.getElementById('password').value; //Password input
    var error = document.getElementById('error') //Error message
    var success = document.getElementById('success') //Success message

    for(let key in json){
        if (service.toLowerCase() === key.toLowerCase()){
            error.classList.remove('hidden'); //Shows error message
            error.innerHTML = "¡Ya existe un servicio con ese nombre!";
            return;
        }
    }

    if (service.trim() !== '' && user.trim() !== '' && password.trim() !== ''){
        error.style.display = 'none'; //Hides error message
        success.classList.remove('hidden'); //Shows success message
        newJSON = {[service]: {user: [], password: []}, ...json} //Creates new key at the beginning
        newJSON[service].user.push(user);
        newJSON[service].password.push(password);
        exec('decrypt.exe', ['--acceptdecrypt'], (error, data) => {
            setTimeout(() =>{
                fs.writeFileSync("C:/UVMC/data.json", JSON.stringify(newJSON), (err) => {});
                exec('encrypt.exe', (err, data) =>{});
            }, 1000);
        });
        setTimeout(() =>{
            neww.style.animation = 'fadeout 0.5s forwards'; //Hide neww div
        }, 3000);
        setTimeout(() => window.location.href = 'showpass.html', 5000); //Go to showpass
    }else{
        error.classList.remove('hidden'); //Shows error message
        error.innerHTML = "Introduce los datos solicitados.";
    }
}