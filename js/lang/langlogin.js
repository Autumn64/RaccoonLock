const interfaces = require("./js/lang/interfaces.js");
const paths = new interfaces(process.platform);
const path = paths.getPath();
const langs = require("./js/lang/languages.json");
const raccoonreader = paths.getReader();
const exec = require('child_process').execFile;

let userinfo;
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{
	exec(raccoonreader, ["-i", `${path}/data.rlc`], (error, stdout, stderr) =>{
		if (error){
			window.location.href = `error.html?err=${encodeURIComponent(error)}`;
			return;
		}
        if (stderr){
			window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
			return;
		}
		
		try{
			let jsonstring = paths.getCorrectJSON(stdout);
			userinfo = JSON.parse(jsonstring);
		}catch(e){
			window.location.href = `error.html?err=${encodeURIComponent(e)}`;
			return;
		};
		currentlang = langs.login[userinfo.language];
		setLang();
		main();
	});
});

function setLang(){
    document.getElementById('bienvenue').innerHTML = currentlang.passwordd.bienvenue;
    document.getElementById('password').placeholder = currentlang.passwordd.password;
    document.getElementById('submit').innerHTML = currentlang.passwordd.submit;

    document.getElementById('code').placeholder = currentlang.verify.code;
    document.getElementById('submitv').innerHTML = currentlang.verify.submitv;
}
