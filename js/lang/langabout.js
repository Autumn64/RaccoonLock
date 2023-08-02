const getPaths = require("./js/lang/getpaths.js");
const paths = new getPaths(process.platform);
const pathh = paths.getPath();
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.about[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('madeby').innerHTML = currentlang.about.madeby;
    document.getElementById('author').innerHTML = currentlang.about.author;
    document.getElementById('license').innerHTML = currentlang.about.license;
}
