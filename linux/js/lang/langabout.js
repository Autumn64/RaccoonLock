const os = require("os");
const pathh = `${os.homedir()}/.raccoonlock`;
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.about[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('madeby').innerHTML = currentlang.about.madeby;
    document.getElementById('author').innerHTML = currentlang.about.author;
    document.getElementById('license').innerHTML = currentlang.about.license;
}