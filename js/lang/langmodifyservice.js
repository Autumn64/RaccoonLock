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
                currentlang = langs.modifyservice[userinfo.language];
                setLang();
		main();
        });
});
function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('services').options[0].innerHTML = currentlang.container.select.none;

    document.getElementById('user').placeholder = currentlang.container.modify.user;
    document.getElementById('password').placeholder = currentlang.container.modify.password;
    document.getElementById('success').innerHTML = currentlang.container.modify.success;
    document.getElementById('save').innerHTML = currentlang.container.modify.buttons.save;
    document.getElementById('cancel').innerHTML = currentlang.container.modify.buttons.cancel;
    document.getElementById('delete').innerHTML = currentlang.container.modify.delete;

    document.getElementById('text').innerHTML = currentlang.confirm.text;
    document.getElementById('successb').innerHTML = currentlang.confirm.successb;
    document.getElementById('accept').innerHTML = currentlang.confirm.buttons.accept;
    document.getElementById('cancelb').innerHTML = currentlang.confirm.buttons.cancelb;

    document.getElementById('titleadd').innerHTML = currentlang.addd.titleadd;
    document.getElementById('usera').placeholder = currentlang.addd.usera;
    document.getElementById('passworda').placeholder = currentlang.addd.passworda;
    document.getElementById('successa').innerHTML = currentlang.addd.successa;
    document.getElementById('savea').innerHTML = currentlang.addd.buttons.savea;
    document.getElementById('cancela').innerHTML = currentlang.addd.buttons.cancela;
}
