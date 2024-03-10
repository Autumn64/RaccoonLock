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

let passwordd = document.getElementById('passwordd');

document.getElementById('submit').addEventListener('click', () =>{
    let password = document.getElementById('password').value
    const reader = chp.spawn("./raccoonreader", ["-d", `${path}/data.rld`]);
    reader.stdin.setDefaultEncoding("utf-8");
    reader.stdin.write(`${password}\n`);
    
    reader.stderr.on('data', (error) =>{
        if (!error.includes("FATAL ERROR: Couldn't finish the decryption operation! Did you enter the correct password?")){
            window.location.href = `error.html?err=${encodeURIComponent(error)}`;
        }
        let errora = document.getElementById('errora');
        errora.classList.remove('hidden');
        errora.innerHTML = currentlang.passwordd.errora;
    });

    reader.stdout.on('data', (data) =>{
        let datastr = data.toString().replace(/^RaccoonReader v[\d.]+[\s\S]+?Enter your password:/, '');

        if (datastr.trim() === "") return;

        passwordd.style.animation = 'fadeout 1s forwards';
        setTimeout(() => {
            passwordd.style.display = 'none';
            window.location.href = 'mainmenu.html';
        }, 2000);
    });
});
