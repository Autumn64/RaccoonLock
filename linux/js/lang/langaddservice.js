const os = require("os");
const pathh = `${os.homedir()}/.raccoonlock`;
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.addservice[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('other').innerHTML = currentlang.container.otherbtn.other;

    document.getElementById('titlenew').innerHTML = currentlang.neww.titlenew;
    document.getElementById('service').placeholder = currentlang.neww.service;
    document.getElementById('user').placeholder = currentlang.neww.user;
    document.getElementById('password').placeholder = currentlang.neww.password;
    document.getElementById('success').innerHTML = currentlang.neww.success;
    document.getElementById('submit').innerHTML = currentlang.neww.submit;
}