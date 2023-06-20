const fs = require('fs');
var exec = require('child_process').execFile;

var json;
var keys = [];
const container = document.getElementById('container');
const copied = document.getElementById('copied');
var theresData = true;

window.addEventListener('DOMContentLoaded', () =>{
    exec('decrypt.exe', ['--acceptdecrypt'], (error, data) => {setTimeout(getData, 1000);});
});

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'mainmenu.html');

function getData(){
    json = JSON.parse(fs.readFileSync('C:/UVMC/data.json', 'utf8'));
    exec('encrypt.exe', (error, data) => {});
    container.classList.remove('hidden'); //Shows container
    container.style.display = 'flex';
    container.style.animation = 'fadein 0.5s';
    for(var key in json){
        keys.push(key);
    }
    if (keys.length === 0){
        container.innerHTML += "No hay datos para mostrar.";
        theresData = false;
    }
    if (theresData === true){
        keys.forEach(showData);
        var alldivs = Array.from(document.getElementsByClassName('data'));
    for(let i = 0; i < alldivs.length; i++){
        alldivs[i].addEventListener('click', () => {
            navigator.clipboard.writeText(alldivs[i].innerHTML);
            copied.classList.remove('hidden');
            copied.style.display = '';
            copied.style.animation = 'fadein 0.2s';
            setTimeout(() =>{
                copied.style.animation = 'fadeout 0.2s forwards';
            }, 3000);
            setTimeout(() => copied.style.display = 'none', 4000);
            });
        }
    }
}

function showData(key){ //Iterates for each service
    var table = document.createElement('table');
    table.className = 'stuff';
    container.innerHTML += `<h2><u>${key}</u></h2>`; //Specifies the service
    for (let i = 0; i < json[key].user.length; i++){ //For each item in the "user" array
        let rowUser = table.insertRow();
        let cell1User = rowUser.insertCell();
        cell1User.innerHTML = "Usuario: ";
        let cell2User = rowUser.insertCell();
        cell2User.innerHTML = `<div class="data">${json[key].user[i]}</div>`;

        let rowPass = table.insertRow();
        let cell1Pass = rowPass.insertCell();
        cell1Pass.innerHTML = "Contraseña: ";
        let cell2Pass = rowPass.insertCell();
        cell2Pass.innerHTML = `<div class="data">${json[key].password[i]}</div>`; //Password array works the same way
        // Add two empty rows after password row
        let emptyRow1 = table.insertRow();
        let emptyCell1 = emptyRow1.insertCell();
        emptyCell1.innerHTML = "<br>";
        let emptyRow2 = table.insertRow();
        let emptyCell2 = emptyRow2.insertCell();
        emptyCell2.innerHTML = "<br>";
    }
    container.appendChild(table);
}