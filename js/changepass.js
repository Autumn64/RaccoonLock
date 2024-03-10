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

const chp = require('child_process');
const { ipcRenderer } = require('electron');

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'settings.html');

document.getElementById('save').addEventListener('click', getData);

function getData(){
    let datastr;
    const password = document.getElementById('oldpass').value;
    const reader = chp.spawn(interfaces.getReader(), ["-d", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${password}\n`);
    reader.stdin.end();
    reader.stderr.on('data', (error) =>{
        if (!error.includes("FATAL ERROR: Couldn't finish the decryption operation! Did you enter the correct password?")){
            window.location.href = `error.html?err=${encodeURIComponent(error)}`;
        }
        ipcRenderer.send('message', currentlang.errwp);
    });

    reader.stdout.on('data', (data) =>{
        datastr = data.toString().replace(/^RaccoonReader v[\d.]+[\s\S]+?Enter your password:/, '');
        if (datastr.trim() === "") return;
    });

    reader.on('close', (code) =>{
        reader.stdin.end();
        if (datastr.trim() !== "") updatePass(datastr);
    });
}

function updatePass(data){
    const newpassword = document.getElementById('newpass').value.trim();

    if (newpassword.length < 8){
        ipcRenderer.send('message', currentlang.errsp);
        return;
    }

    if (document.getElementById('renewpass').value.trim() != newpassword){
        ipcRenderer.send('message', currentlang.errdp);
        return;
    }

    const reader = chp.spawn(interfaces.getReader(), ["-c", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${data}\n`);
    reader.stdin.write(`${newpassword}\n`);
    reader.stdin.write(`${newpassword}\n`);
    reader.stdin.end();

    reader.stderr.on('data', (error) =>{
        console.error(error.toString());
        //window.location.href = `error.html?err=${encodeURIComponent(errorstr)}`;
    });

    reader.stdout.on('data', (data) =>{
        let datastr = data.toString();
        if (datastr.includes("Data encrypted successfully!"))
            ipcRenderer.send('message', currentlang.success);
    });
}