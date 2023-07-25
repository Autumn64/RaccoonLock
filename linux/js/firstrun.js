const os = require("os");
const path = `${os.homedir()}/.raccoonlock`;
let exec = require('child_process').execFile;
const sendMail = require('./js/sendmail.js')
const fs = require('fs');

let twoFA = "";

window.addEventListener('DOMContentLoaded', () =>{
    const bienvenue = document.getElementById('bienvenue');
    const login = document.getElementById('login');

    document.documentElement.style.alignItems = 'center'; //Moves the Bienvenid@ to the center
    document.body.style.alignItems = 'center';
    bienvenue.classList.remove('hidden'); //Shows bienvenue
    bienvenue.style.animation = 'fadeinout 4s linear';
    bienvenue.addEventListener('animationend', () =>{
        bienvenue.style.display = 'none'; //Removes bienvenue
        document.documentElement.style.alignItems = 'unset'; //Removes center
        document.body.style.alignItems = 'unset';
        login.classList.remove('hidden'); //Shows login
        login.style.animation = 'fadein 1s';
        login.style.display = 'flex';
    });
});

document.getElementById('submit').addEventListener('click', () =>{ //Comenzar button
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    if (name.trim() !== "" && email.trim() !== "" && password.trim() !== ""){ //There has to be something in all the inputs
        const login = document.getElementById('login');
        const verify = document.getElementById('verify');
        login.style.animation = 'fadeout 0.5s';
        login.style.display = 'none'; //Removes login
        setTimeout(()=>{
            verify.classList.remove('hidden'); //Shows verify
            verify.style.animation = 'fadein 0.5s';
            verify.style.display = 'flex';
            document.getElementById('nowenter').innerHTML = `Now enter the code that was sent to <br>${email}.`;
        }, 1000);
        sendm(email);
    }else{
        let err = document.getElementById('error');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "Enter the requested data.";
    }
});

document.getElementById('submitv').addEventListener('click', () =>{ //Verificar button
    let password = document.getElementById('password').value;
    let code = document.getElementById('code').value;
    let verify = document.getElementById('verify');
    let userWrotePassword;
    if (code === twoFA || code === password){
        userWrotePassword = code === password ? true : false;
        fs.mkdirSync(`${path}/`);
        let info = {
            name: document.getElementById('name').value.trimStart(),
            user: document.getElementById('email').value.trimStart(),
            phone: "",
            birthdate: "",
            passwordmode: false,
            language: "en"
        };
        let data = {
            RaccoonLock: document.getElementById('password').value.trimStart()
        };
        let jsoninfo = JSON.stringify(info);
        let jsondata = JSON.stringify(data);
        fs.writeFileSync(`${path}/info.json`, jsoninfo, (err) =>{});
        fs.writeFileSync(`${path}/data.json`, jsondata, (err) => {});
        exec('./raccoonstealer', ['--createkey'], (err, data) =>{
            exec('./raccoonstealer', ['--encrypt'], (err, data) =>{});
        });
    }else{
        let err = document.getElementById('errorv');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "Wrong code! Try again.";
    }
    if (userWrotePassword === true){ //If user typed the password instead of the code
        document.getElementById('success').classList.remove('hidden');
        let err = document.getElementById('errorv');
        err.style.display = 'none'; //Hides error
        setTimeout(() => verify.style.animation = 'fadeout 1s forwards', 3000);
        setTimeout(()=> {
            verify.style.display = 'none';
            window.location.href = 'verified.html';
        }, 5000);
    }else if (userWrotePassword === false){ //If user typed the code
        verify.style.animation = 'fadeout 1s forwards';
        setTimeout(()=> {
            verify.style.display = 'none';
            window.location.href = 'verified.html';
        }, 2000);
    }
});

document.getElementById('goback').addEventListener('click', () =>{ //Go back
    const login = document.getElementById('login');
    const verify = document.getElementById('verify');
    verify.style.animation = 'fadeout 0.5s';
    verify.style.display = 'none'; //Removes login
    twoFA = ""; //Sets 2FA code to nothing so it can be overwritten
    document.getElementById('error').innerHTML = ""; //Removes error messages
    document.getElementById('errorv').innerHTML = "";
    setTimeout(()=>{
        login.style.animation = 'fadein 0.5s';
        login.style.display = 'flex'; //Shows login again
    }, 1000);
})

function sendm(email){
    const mail = new sendMail(email, "Your code is:");
    twoFA = mail.send();
}