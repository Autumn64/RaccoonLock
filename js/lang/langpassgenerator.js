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
                currentlang = langs.passgenerator[userinfo.language];
                setLang();
        });
});

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('pass_size').options[0].innerHTML = currentlang.container.select.eight;
    document.getElementById('pass_size').options[1].innerHTML = currentlang.container.select.ten;
    document.getElementById('pass_size').options[2].innerHTML = currentlang.container.select.twelve;
    document.getElementById('pass_size').options[3].innerHTML = currentlang.container.select.fifteen;

    document.getElementById('generate').innerHTML = currentlang.container.generate;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
}
