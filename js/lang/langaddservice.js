const interfaces = require("./js/lang/interfaces.js");
const paths = new interfaces(process.platform);
const path = paths.getPath();
const langs = require("./js/lang/languages.json");
const raccoonstealer = paths.getStealer();
const exec = require('child_process').execFile;

let userinfo;
let currentlang;

window.addEventListener('DOMContentLoaded', () =>{ 
        exec(raccoonstealer, ["-i", `${path}/data.rlc`], (error, stdout, stderr) =>{ 
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
                }
                currentlang = langs.addservice[userinfo.language];
                setLang();
		main();
        });
});

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('other').innerHTML = currentlang.container.otherbtn.other;

    document.getElementById('titlenew').innerHTML = currentlang.neww.titlenew;
    document.getElementById('service').placeholder = currentlang.neww.service;
    document.getElementById('user').placeholder = currentlang.neww.user;
    document.getElementById('password').placeholder = currentlang.neww.password;
    document.getElementById('success').innerHTML = currentlang.neww.success;
    document.getElementById('submit').innerHTML = currentlang.neww.submit;
    document.getElementById('nowenter').innerHTML = currentlang.verify.nowenter;
    document.getElementById('vpass').placeholder = currentlang.verify.vpass;
    document.getElementById('errorv').innerHTML = currentlang.verify.errorv;
    document.getElementById('vsubmit').innerHTML = currentlang.verify.vsubmit;
}
