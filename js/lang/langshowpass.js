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
                }
                currentlang = langs.showpass[userinfo.language];
                setLang();
		main();
        });
});

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('search').placeholder = currentlang.container.search;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
    document.getElementById('nowenter').innerHTML = currentlang.verify.nowenter;
    document.getElementById('vpass').placeholder = currentlang.verify.vpass;
    document.getElementById('errorv').innerHTML = currentlang.verify.errorv;
    document.getElementById('vsubmit').innerHTML = currentlang.verify.vsubmit;
}
