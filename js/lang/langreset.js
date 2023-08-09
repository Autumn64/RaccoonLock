const getPaths = require("./js/lang/getpaths.js");
const paths = new getPaths(process.platform);
const pathh = paths.getPath();
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.reset[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('text').innerHTML = currentlang.text;
    document.getElementById('accept').innerHTML = currentlang.buttons.accept;
    document.getElementById('cancel').innerHTML = currentlang.buttons.cancel;
}