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

const { ipcRenderer } = require('electron');
const exec = require('child_process').execFile;
const fs = require("fs");

let path;

window.addEventListener("DOMContentLoaded", () =>{
    ipcRenderer.send('send-path');
});

document.getElementById("startbtn").addEventListener("click", () =>{
    createConfig();
});

function createConfig(){
    exec("./oldreader", ["-i", `${path}/data.rlc`], (error, stdout, stderr) =>{
        let config = getCorrectJSON(stdout);
        fs.writeFileSync(`${path}/config.json`, config);
        ipcRenderer.send("success-dataup");
    });
}

function getCorrectJSON(string){ //Kept because without this there's no way to actually get the JSON objects.
    let jsonOnly = decodeURIComponent(string);
    let last = jsonOnly.lastIndexOf('}');
    if (last === -1) return `${string} is not a valid JSON string`;
    return jsonOnly.substring(0, last + 1);
}

// ---------- IPC LISTENERS ----------

ipcRenderer.on('receive-path', (event, cpath) =>{
    path = cpath;
});