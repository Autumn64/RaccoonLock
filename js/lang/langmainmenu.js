const getPaths = require("./js/lang/getpaths.js");
const paths = new getPaths(process.platform);
const pathh = paths.getPath();
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.mainmenu[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('logout').innerHTML = currentlang.topbar.logout;
    document.getElementById('passgen').innerHTML = currentlang.buttons.passgen;
    document.getElementById('showpass').innerHTML = currentlang.buttons.showpass;
    document.getElementById('editpass').innerHTML = currentlang.buttons.editpass;
    document.getElementById('addservice').innerHTML = currentlang.modify.addservice;
    document.getElementById('modifyservice').innerHTML = currentlang.modify.modifyservice;
}