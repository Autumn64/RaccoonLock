const raccoonstealer = paths.getStealer();
let exec = require('child_process').execFile;

let json;
let keys = [];
const container = document.getElementById('container');
const copied = document.getElementById('copied');
let theresData = true;

window.addEventListener('DOMContentLoaded', () =>{
    exec(raccoonstealer, ['--decrypt', '--acceptdecrypt'], (error, stdout, stderr) => {
        json = JSON.parse(stdout);
        container.classList.remove('hidden'); //Shows container
        container.style.display = 'flex';
        container.style.animation = 'fadein 0.5s';
        for(let key in json){
            if (key === 'RaccoonLock') continue; //Ignores the app's password
            keys.push(key);
        }
        setData();
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
        cell2User.innerHTML = `<div class="data" tabindex="1">${json[key].user[i]}</div>`;

        let rowPass = table.insertRow();
        let cell1Pass = rowPass.insertCell();
        cell1Pass.innerHTML = currentlang.container.table.password;
        let cell2Pass = rowPass.insertCell();
        cell2Pass.innerHTML = `<div class="data" tabindex="1">${json[key].password[i]}</div>`; //Password array works the same way
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
    let alldivs = Array.from(document.getElementsByClassName('data'));
    for(let i = 0; i < alldivs.length; i++){
        alldivs[i].addEventListener('click', () => copy(alldivs[i].innerHTML));
        alldivs[i].addEventListener('keypress', event => {if(event.key === 'Enter') copy(alldivs[i].innerHTML);});
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