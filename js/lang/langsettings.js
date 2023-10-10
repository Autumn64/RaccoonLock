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
                currentlang = langs.settings[userinfo.language];
                setLang();
		main();
        });
});

function setLang(){
    document.getElementById('about').innerHTML = currentlang.topbar.about;
    document.getElementById('title').innerHTML = currentlang.info.title;

    document.getElementById('tdname').innerHTML = currentlang.info.table.tdname;
    document.getElementById('tdnameindex').innerHTML = currentlang.info.table.tdnameindex;
    document.getElementById('tdmail').innerHTML = currentlang.info.table.tdmail;
    document.getElementById('tdphone').innerHTML = currentlang.info.table.tdphone;
    document.getElementById('tdbirthday').innerHTML = currentlang.info.table.tdbirthday;
    document.getElementById('tdpassword').innerHTML = currentlang.info.table.tdpassword;
    document.getElementById('tdpasswordmode').innerHTML = currentlang.info.table.tdpasswordmode;
    document.getElementById('name').placeholder = currentlang.info.table.name;
    document.getElementById('user').placeholder = currentlang.info.table.user;
    document.getElementById('phone').placeholder = currentlang.info.table.phone;
    document.getElementById('birthdate').placeholder = currentlang.info.table.birthdate;
    document.getElementById('password').placeholder = currentlang.info.table.password;
    document.getElementById('language').value = userinfo.language;

    document.getElementById('save').innerHTML = currentlang.info.save;
    document.getElementById('backup').innerHTML = currentlang.info.backup;
    document.getElementById('reset').innerHTML = currentlang.info.reset;

    document.getElementById('code').placeholder = currentlang.verify.code;
    document.getElementById('success').innerHTML = currentlang.verify.sucess;
    document.getElementById('submitv').innerHTML = currentlang.verify.submitv;
    document.getElementById('gobackl').innerHTML = currentlang.verify.gobackl;
}
