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
        currentlang = langs.settings[userinfo.language];
        setLang();
        main();
});

function setLang(){
    document.getElementById('about').innerHTML = currentlang.topbar.about;
    document.getElementById('title').innerHTML = currentlang.info.title;

    document.getElementById('tdname').innerHTML = currentlang.info.table.tdname;
    document.getElementById('tdlanguage').innerHTML = currentlang.info.table.tdlanguage;
    document.getElementById('name').placeholder = currentlang.info.table.name;
    document.getElementById('language').value = userinfo.language;

    document.getElementById('changepasswd').innerHTML = currentlang.info.changepasswd;
    document.getElementById('save').innerHTML = currentlang.info.save;
    document.getElementById('backup').innerHTML = currentlang.info.backup;
    document.getElementById('restore').innerHTML = currentlang.info.restore;
    document.getElementById('reset').innerHTML = currentlang.info.reset;
}
