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

// This code works but it didn't really convince me, so I will probably refactor ir later.

const { ipcRenderer } = require('electron');
const chp = require('child_process');
const fs = require("fs");

let path;

window.addEventListener("DOMContentLoaded", () =>{
    ipcRenderer.send('send-path');
});

document.getElementById("startbtn").addEventListener("click", () =>{
    createConfig();
    createData();
    ipcRenderer.send("success-dataup");
});

function createConfig(){
    chp.execFile("./oldreader", ["-i", `${path}/data.rlc`], (error, stdout, stderr) =>{
        let config = getCorrectJSON(stdout);
        saveConfig(config);
    });
}

function saveConfig(config){
    config = JSON.parse(config);
    delete config["user"];
    delete config["phone"];
    delete config["birthdate"];
    delete config["passwordmode"];
    delete config["index"];
    fs.writeFileSync(`${path}/config.json`, JSON.stringify(config));
}

function createData(){
    let data, pass;
    chp.execFile("./oldreader", ["-d", "-y", `${path}/data.rlc`], (error, stdout, stderr) =>{
        let sdata = getCorrectJSON(stdout);
        data = JSON.parse(sdata);
        pass = data["RaccoonLock"]
        delete data["RaccoonLock"];
        saveData(data, pass);
    });
}

function saveData(data, pass){
    data = encodeJSON(JSON.stringify(data));

    const reader = chp.spawn("./raccoonreader", ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${data}\n`);
    reader.stdin.write(`${pass}\n`);
    reader.stdin.write(`${pass}\n`);

}

function getCorrectJSON(string){ //Kept because without this there's no way to actually get the JSON objects.
    let jsonOnly = decodeURIComponent(string);
    let last = jsonOnly.lastIndexOf('}');
    if (last === -1) return `${string} is not a valid JSON string`;
    return jsonOnly.substring(0, last + 1);
}

function encodeJSON(string){
    let newString = encodeURIComponent(string);
    return newString;
}

// ---------- IPC LISTENERS ----------

ipcRenderer.on('receive-path', (event, cpath) =>{
    path = cpath;
});