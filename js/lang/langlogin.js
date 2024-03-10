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

let userinfo;
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{
	userinfo = require(`${path}/config.json`);
	currentlang = langs.login[userinfo.language];
	setLang();
});

function setLang(){
    document.getElementById('bienvenue').innerHTML = currentlang.passwordd.bienvenue;
    document.getElementById('password').placeholder = currentlang.passwordd.password;
    document.getElementById('submit').innerHTML = currentlang.passwordd.submit;
}
