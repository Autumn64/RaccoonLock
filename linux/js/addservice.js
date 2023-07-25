const path = `${os.homedir()}/.raccoonlock`;
const fs = require('fs');
let exec = require('child_process').execFile;

let json;
let container = document.getElementById('container');
let neww = document.getElementById('neww');

window.addEventListener('DOMContentLoaded', () =>{
    exec('./raccoonstealer', ['--decrypt', '--acceptdecrypt'], (error, stdout, stderr) => {
        let other = document.getElementById('other');
        json = JSON.parse(stdout);
        container.classList.remove('hidden');
        container.style.display = 'flex';
        container.style.animation = 'fadein 0.5s';
        let buttons = Array.from(document.getElementsByClassName('picbtn')); //Gets all buttons
        for (let i = 0; i < buttons.length ; i++){
            buttons[i].addEventListener('click', () => checkIfExists(buttons[i].id));
        }
        other.addEventListener('click', () => createNew('')); //'Add other' button
    });
});

document.getElementById('goback').addEventListener('click', () => //Go back button
    window.location.href = 'mainmenu.html');

document.getElementById('submit').addEventListener('click', addData); //Submit button

function checkIfExists(id){
    for(let key in json){
        if (id.toLowerCase() === key.toLowerCase()){ //If it exists send to modify service page
            let location = `modifyservice.html?id=${encodeURIComponent(key)}`
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

    if (service.trim() !== '' && user.trim() !== '' && password.trim() !== ''){
        document.getElementById("submit").style.animation = "fadeout 0.5s forwards";
        error.style.display = 'none'; //Hides error message
        success.classList.remove('hidden'); //Shows success message
        newJSON = {[service]: {user: [], password: []}, ...json} //Creates new key at the beginning
        newJSON[service].user.push(user);
        newJSON[service].password.push(password);
        document.getElementById('goback').style.display = 'none'; //Hide back button
        fs.writeFileSync(`${path}/data.json`, JSON.stringify(newJSON), (err) => {});
        exec('./raccoonstealer', ['--encrypt'], (err, data) =>{});
        setTimeout(() =>{
            neww.style.animation = 'fadeout 0.5s forwards'; //Hide neww div
        }, 3000);
        setTimeout(() => window.location.href = 'showpass.html', 5000); //Go to showpass
    }else{
        error.classList.remove('hidden'); //Shows error message
        error.innerHTML = currentlang.neww.error[1];
    }
}