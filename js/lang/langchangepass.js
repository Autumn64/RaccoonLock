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
        currentlang = langs.changepass[userinfo.language];
        setLang();
});

function setLang(){
    document.getElementById('title').innerHTML = currentlang.title;
    document.getElementById('oldpass').placeholder = currentlang.oldpass;
    document.getElementById('newpass').placeholder = currentlang.newpass;
    document.getElementById('renewpass').placeholder = currentlang.renewpass;
    document.getElementById('save').innerHTML = currentlang.save;
}