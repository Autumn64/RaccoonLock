const info = require('C:/RaccoonLock/info.json');
const nodemailer = require('nodemailer');
const fs = require('fs');
var exec = require('child_process').execFile;

var twoFA = "";
var passjson = "";
const email = info.user;
var passwordd = document.getElementById('passwordd');

window.addEventListener('DOMContentLoaded', () =>{
    info.passwordmode === false ? sendMail() : askPass();
});

document.getElementById('submitv').addEventListener('click', () =>{
    var code = document.getElementById('code').value;
    var verify = document.getElementById('verify');

    if (code === twoFA){
        verify.style.animation = 'fadeout 1s forwards';
        setTimeout(() => window.location.href = 'mainmenu.html', 5000);
    }else{
        var err = document.getElementById('error');
        err.classList.remove('hidden');
        err.innerHTML = "Wrong code! Try again.";
    }
});

document.getElementById('submit').addEventListener('click', () =>{
    var password = document.getElementById('password').value;
    if (password === passjson){
        passwordd.style.animation = 'fadeout 1s forwards';
        setTimeout(() => window.location.href = 'mainmenu.html', 5000);
    }else{
        var errora = document.getElementById('errora');
        errora.classList.remove('hidden');
        errora.innerHTML = "Wrong password! Try again.";
    }
});

const askPass = () =>{
    exec('decrypt.exe', ['--acceptdecrypt'], (error, data) => {
        getPass();
    });
}

function getPass(){
    data = JSON.parse(fs.readFileSync('C:/RaccoonLock/data.json', 'utf8'));
    passjson = data.RaccoonLock;
    exec('encrypt.exe', (error, data) => {});
    passwordd.classList.remove('hidden');
    passwordd.style.animation = 'fadein 0.5s';
}

async function sendMail(){
    var verify = document.getElementById('verify');
    verify.classList.remove('hidden');
    verify.style.animation = 'fadein 0.5s';
    document.getElementById('message').innerHTML = `Enter the code sent to<br>${email}.`
    for (let i = 1; i <= 6; i++){
        twoFA += (Math.floor(Math.random() * 9)).toString();
    }

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "MAIL",
          pass: "PASSWORD",
        },
    });

    await transporter.sendMail({
        from: "MAIL",
        to: email,
        subject: "2FA code verification.",
        text: `Your code is: ${twoFA}`
    });
}