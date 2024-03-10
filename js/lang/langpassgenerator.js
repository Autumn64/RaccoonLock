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

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('pass_size').options[0].innerHTML = currentlang.container.select.eight;
    document.getElementById('pass_size').options[1].innerHTML = currentlang.container.select.ten;
    document.getElementById('pass_size').options[2].innerHTML = currentlang.container.select.twelve;
    document.getElementById('pass_size').options[3].innerHTML = currentlang.container.select.fifteen;

    document.getElementById('generate').innerHTML = currentlang.container.generate;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
}
