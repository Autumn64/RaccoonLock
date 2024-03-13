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
const fs = require('fs');

window.addEventListener('DOMContentLoaded', () => {
    let div = document.getElementById('starting');
    let container = document.getElementById('container');

    if (fs.existsSync(`${path}/data.rlc`)){
        setTimeout(() => container.style.animation = 'fadeout 1s forwards', 2000);
        setTimeout(() => window.location.href = 'newversion.html', 3000);
        return;
    }

    if(!fs.existsSync(`${path}/data.rld`) && !fs.existsSync(`${path}/config.json`)){
        setTimeout(() => div.innerHTML += "<br>Preparing to start for the first time...", 3000);
        setTimeout(() => container.style.animation = 'fadeout 1s forwards', 8000);
        setTimeout(() => window.location.href = 'firstrun.html', 10000);
        return;
    }

    if(fs.existsSync(`${path}/data.rld`) && !fs.existsSync(`${path}/config.json`)){
        setTimeout(() => window.location.href = `error.html?err=${encodeURIComponent("Config file not found!")}`, 2000);
        return;
    }

    if(!fs.existsSync(`${path}/data.rld`) && fs.existsSync(`${path}/config.json`)){
        setTimeout(() => window.location.href = `error.html?err=${encodeURIComponent("FATAL ERROR: Data file not found!")}`, 2000);
        return;
    }
    
    setTimeout(() => div.innerHTML += '<img src="res/spinner2.gif" class="img-loading">', 3000);
    setTimeout(() => container.style.animation = 'fadeout 1s forwards', 4000);
    setTimeout(() => window.location.href = 'login.html', 5000);
});
