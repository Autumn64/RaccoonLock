const getPaths = require("./js/lang/getpaths.js");
const paths = new getPaths(process.platform);
const pathh = paths.getPath();
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.login[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('bienvenue').innerHTML = currentlang.passwordd.bienvenue;
    document.getElementById('password').placeholder = currentlang.passwordd.password;
    document.getElementById('submit').innerHTML = currentlang.passwordd.submit;

    document.getElementById('code').placeholder = currentlang.verify.code;
    document.getElementById('submitv').innerHTML = currentlang.verify.submitv;
}