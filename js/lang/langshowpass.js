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
                currentlang = langs.showpass[userinfo.language];
                setLang();
		main();
        });
});

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('search').placeholder = currentlang.container.search;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
}
