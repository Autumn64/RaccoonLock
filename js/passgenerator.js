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
const langs = require("./js/lang/languages.json");

let userinfo = require(`${path}/config.json`);
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{ 
        currentlang = langs.passgenerator[userinfo.language];
        setLang();
});

let randompass = '';

document.getElementById('goback').addEventListener('click', () => //Go back button
    window.location.href = 'mainmenu.html');

document.getElementById('generate').addEventListener('click', () =>{ //Generar button
    let pass = document.getElementById('pass');
    let selection = document.getElementById('pass_size').value;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%?*0123456789"
    pass.innerHTML = "";
    randompass = "";
    for(;;){
    	for (let i = 1; i <= Number(selection); i++){
        	randompass += charset.charAt(Math.floor(Math.random() * charset.length)); //Get random index
    	}
        const digits = randompass.match(/\d/g);
        const specialChars = randompass.match(/[!#&%$?*]/g);
        if (digits !== null && specialChars !== null && digits.length >= 2 && specialChars.length >= 2){
            pass.innerHTML = randompass;
            break;
        }
        randompass = "";
    }
});

document.getElementById('pass').addEventListener('click', copy);
document.getElementById('pass').addEventListener('keypress', event => {if(event.key === 'Enter') copy();});

const clearAllTimeouts = () =>{
    let highestTimeoutId = setTimeout(() =>{});
    for (let i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i); 
    }
}

function copy(){
    let pass = document.getElementById('pass');
    let copied = document.getElementById('copied');
    if (pass.innerHTML !== '&nbsp;'){
        navigator.clipboard.writeText(pass.innerHTML);
        copied.classList.remove('hidden');
        copied.style.display = '';
        copied.style.animation = 'fadein 0.2s';
        clearAllTimeouts();
        setTimeout(() =>{
            copied.style.animation = 'fadeout 0.2s forwards';
        }, 3000);
        setTimeout(() => copied.style.display = 'none', 4000);
    }
}

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('pass_size').options[0].innerHTML = currentlang.container.select.eight;
    document.getElementById('pass_size').options[1].innerHTML = currentlang.container.select.ten;
    document.getElementById('pass_size').options[2].innerHTML = currentlang.container.select.twelve;
    document.getElementById('pass_size').options[3].innerHTML = currentlang.container.select.fifteen;

    document.getElementById('generate').innerHTML = currentlang.container.generate;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
}