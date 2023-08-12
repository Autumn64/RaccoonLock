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
                        console.error(error);
                        return;
                }
                if (stderr){
                        console.error(stderr);
                        return;
                }

                let jsonstring = paths.getCorrectJSON(stdout);
		userinfo = JSON.parse(jsonstring);
                currentlang = langs.about[userinfo.language];
                setLang();
        });
});

function setLang(){
    document.getElementById('madeby').innerHTML = currentlang.about.madeby;
    document.getElementById('author').innerHTML = currentlang.about.author;
    document.getElementById('license').innerHTML = currentlang.about.license;
}
