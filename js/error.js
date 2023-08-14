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
	fs.appendFileSync(`${path}/errors.rld`, dump);
});
