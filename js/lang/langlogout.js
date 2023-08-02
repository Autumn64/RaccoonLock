const getPaths = require("./js/lang/getpaths.js");
const paths = new getPaths(process.platform);
const pathh = paths.getPath();
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.logout[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('signedout').innerHTML = currentlang.signedout;
    document.getElementById('ok').innerHTML = currentlang.ok;
}