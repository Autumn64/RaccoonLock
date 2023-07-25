const os = require("os");
const pathh = `${os.homedir()}/.raccoonlock`;
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.passgenerator[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('pass_size').options[0].innerHTML = currentlang.container.select.eight;
    document.getElementById('pass_size').options[1].innerHTML = currentlang.container.select.ten;
    document.getElementById('pass_size').options[2].innerHTML = currentlang.container.select.twelve;
    document.getElementById('pass_size').options[3].innerHTML = currentlang.container.select.fifteen;

    document.getElementById('generate').innerHTML = currentlang.container.generate;
    document.getElementById('copied').innerHTML = currentlang.container.copied;
}