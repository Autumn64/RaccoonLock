const os = require("os");
const pathh = `${os.homedir()}/.raccoonlock`;
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.showpass[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('search').placeholder = currentlang.container.search;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
}