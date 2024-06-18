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

document.getElementById('save').addEventListener('click', getData);

function getData(){
    chp.execFile(interfaces.getOldReader(), ["-d", "-y", `${path}/data.rlc`], (error, stdout, stderr) =>{
        let sdata = interfaces.decodeJSON(stdout);
        let data = JSON.parse(sdata);
        delete data["RaccoonLock"];
        updatePass(data, document.getElementById("newpass").value.trim());
    });
}

function updatePass(data, newpass){
    if (newpass.length < 8){
        ipcRenderer.send('message', "The password must be longer than 8 characters!");
        cleanInputs();
        return;
    }

    if (document.getElementById('renewpass').value.trim() != newpass){
        ipcRenderer.send('message', "The passwords don't match!");
        cleanInputs();
        return;
    }
    data = interfaces.encodeJSON(JSON.stringify(data));
    const reader = chp.spawn(interfaces.getReader(), ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${data}\n`);
    reader.stdin.write(`${newpass}\n`);
    reader.stdin.write(`${newpass}\n`);
    reader.stdin.end();
    reader.stderr.on('data', (error) =>{
        window.location.href = `error.html?err=${encodeURIComponent(error.toString())}`;
    });

    reader.stdout.on('data', (data) =>{
        if (data.toString().includes("Data encrypted successfully!"))
            ipcRenderer.send('message', "Password changed successfully!");
            endOperation();
    });
}

const endOperation = () =>{
    ipcRenderer.send("message", "Data updated successfully! You can now use RaccoonLock v5.1.0.");
    ipcRenderer.send("message", "It is highly recommended to create a backup so you can restore your information anywhere at anytime.")
    ipcRenderer.send("message", "RaccoonLock will restart.");
    fs.rmSync(`${path}/data.rlc`);
    ipcRenderer.send("restart");
}

const cleanInputs = () =>{
    document.getElementById('newpass').value = "";
    document.getElementById('renewpass').value = "";
}