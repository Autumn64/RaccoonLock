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
const chp = require('child_process');
const fs = require("fs");
const interfaces = require("./js/interfaces.js");
let path = interfaces.getPath();

/*window.addEventListener("DOMContentLoaded", () =>{
    //Get the information related to the operating system in order to ensure a multi-platform environment.
    ipcRenderer.send('send-path');
});*/

document.getElementById("startbtn").addEventListener("click", () =>{
    //Remove the "Start" button and add a text saying "Updating data..."
    document.getElementById("startbtn").remove();
    document.getElementById("container").innerHTML += "<h3>Updating data...</h3>"
    createConfig();
    createData();
    setTimeout(() => {
        ipcRenderer.send("message", "Data updated successfully! You can now use RaccoonLock v5.1.0.");
        ipcRenderer.send("message", "It is highly recommended to create a backup so you can restore your information anywhere at anytime.")
        ipcRenderer.send("message", "RaccoonLock will restart.");
        ipcRenderer.send("restart");
    }, 2000);
});

function createConfig(){
    //Get settings from the old data.rlc file.
    chp.execFile(interfaces.getOldReader(), ["-i", `${path}/data.rlc`], (error, stdout, stderr) =>{
        let config = interfaces.decodeJSON(stdout);
        saveConfig(config);
    });
}

function saveConfig(config){
    //Only keep the name and the language setting.
    config = JSON.parse(config);
    delete config["user"];
    delete config["phone"];
    delete config["birthdate"];
    delete config["passwordmode"];
    delete config["index"];
    fs.writeFileSync(`${path}/config.json`, JSON.stringify(config));
}

function createData(){
    //Get the encrypted data and the user's password from the old data.rlc file.
    let data, pass;
    chp.execFile(interfaces.getOldReader(), ["-d", "-y", `${path}/data.rlc`], (error, stdout, stderr) =>{
        let sdata = interfaces.decodeJSON(stdout);
        data = JSON.parse(sdata);
        pass = data["RaccoonLock"];
        delete data["RaccoonLock"];
        if(pass.length < 8){
            clearAllTimeouts();
            ipcRenderer.send("message", "It looks like you're using an unsafe password! In the next screen you will be able to change it.");
            window.location.href = "changepass_new.html";
            return;
        }
        saveData(data, pass);
    });
}

function saveData(data, pass){
    //Save the new data.rld file with the same data and password.
    data = interfaces.encodeJSON(JSON.stringify(data));
    const reader = chp.spawn(interfaces.getReader(), ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${data}\n`);
    reader.stdin.write(`${pass}\n`);
    reader.stdin.write(`${pass}\n`);
    reader.stdin.end();
    deleteOld();
}

function deleteOld(){
    fs.rmSync(`${path}/data.rlc`);
}

const clearAllTimeouts = () =>{
    let highestTimeoutId = setTimeout(() =>{});
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i); 
    }
}