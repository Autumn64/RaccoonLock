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

const fs = require('fs');
const interfaces = require("./js/lang/interfaces.js");
const paths = new interfaces(process.platform);
const path = paths.getPath();

document.addEventListener('DOMContentLoaded', () =>{
	let dump;
	let parameters = new URLSearchParams(document.location.search);
	let errorMsg = decodeURIComponent(parameters.get('err'));
	let date = new Date();
	document.getElementById('err').innerHTML = errorMsg;
	dump = `System: ${process.platform}\nTime: ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getUTCHours()}:${date.getUTCMinutes()} UTC\n${errorMsg}\n`;
	fs.appendFileSync(`${path}/errors.rle`, dump);
});
