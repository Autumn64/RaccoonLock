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
const interfaces = require("./js/interfaces.js");
let parameters = new URLSearchParams(document.location.search);

/*
    This seems to work quite well though I don't like how it's reading stderr and stdout.
    The last things we need here are a way to communicate the password to the main process so
    when the user gets past the next screen it can read again the data file, an error message that will
    be shown if the user typed a wrong password, and a way to get the actual JSON information
    rather than the whole thing sent through stdout (probably it'd be better to implement that
    in each screen instead of doing it here though).
*/
function checkPassword(password){
    let reader = chp.spawn("./raccoonreader", ["-d", `${interfaces.getPath()}/data.rld`]);
    reader.stdout.pipe(process.stdout);
    reader.stdin.write(`${password}\n`);
    reader.stdin.end();

    reader.stderr.on("data", (data) =>{
        console.error(`${data}`);
    });

    reader.stdout.on("data", (data) =>{
        console.log(`${data}`);
    });
}

document.getElementById("cancel").addEventListener("click", () =>{
    history.back();
});

document.getElementById("ok").addEventListener("click", () =>{
    checkPassword(document.getElementById("password").value);
});