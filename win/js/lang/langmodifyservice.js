const pathh = `${process.env.LOCALAPPDATA}/Raccoonlock`;
const userinfo = require(`${pathh}/info.json`);
const langs = require("./js/lang/languages.json");

const currentlang = langs.modifyservice[userinfo.language];

window.addEventListener('DOMContentLoaded', setLang);

function setLang(){
    document.getElementById('title').innerHTML = currentlang.container.title;
    document.getElementById('services').options[0].innerHTML = currentlang.container.select.none;

    document.getElementById('user').placeholder = currentlang.container.modify.user;
    document.getElementById('password').placeholder = currentlang.container.modify.password;
    document.getElementById('success').innerHTML = currentlang.container.modify.success;
    document.getElementById('save').innerHTML = currentlang.container.modify.buttons.save;
    document.getElementById('cancel').innerHTML = currentlang.container.modify.buttons.cancel;
    document.getElementById('delete').innerHTML = currentlang.container.modify.delete;

    document.getElementById('text').innerHTML = currentlang.confirm.text;
    document.getElementById('successb').innerHTML = currentlang.confirm.successb;
    document.getElementById('accept').innerHTML = currentlang.confirm.buttons.accept;
    document.getElementById('cancelb').innerHTML = currentlang.confirm.buttons.cancelb;

    document.getElementById('titleadd').innerHTML = currentlang.addd.titleadd;
    document.getElementById('usera').placeholder = currentlang.addd.usera;
    document.getElementById('passworda').placeholder = currentlang.addd.passworda;
    document.getElementById('successa').innerHTML = currentlang.addd.successa;
    document.getElementById('savea').innerHTML = currentlang.addd.buttons.savea;
    document.getElementById('cancela').innerHTML = currentlang.addd.buttons.cancela;
}