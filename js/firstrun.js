const nodemailer = require('nodemailer');
var exec = require('child_process').execFile;
const fs = require('fs');

var twoFA = "";

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
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    if (name.trim() !== "" && email.trim() !== "" && phone.trim() !== ""){ //There has to be something in all the inputs
        const login = document.getElementById('login');
        const verify = document.getElementById('verify');
        login.style.animation = 'fadeout 0.5s';
        login.style.display = 'none'; //Removes login
        setTimeout(()=>{
            verify.classList.remove('hidden'); //Shows verify
            verify.style.animation = 'fadein 0.5s';
            verify.style.display = 'flex';
        }, 1000);
        sendMail(email);
    }else{
        var err = document.getElementById('error');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "Enter the requested data.";
    }
});

document.getElementById('submitv').addEventListener('click', () =>{ //Verificar button
    var code = document.getElementById('code').value;
    var verify = document.getElementById('verify');
    if (code === twoFA){
        fs.mkdirSync("C:/RaccoonLock/");
        var info = {
            name: document.getElementById('name').value.trimStart(),
            user: document.getElementById('email').value.trimStart(),
            phone: document.getElementById('phone').value.trimStart(),
            birthdate: ""
        };
        var data = {
        };
        var json = JSON.stringify(info);
        var jsondata = JSON.stringify(data);
        fs.writeFileSync("C:/RaccoonLock/info.json", json, (err) =>{});
        fs.writeFileSync("C:/RaccoonLock/data.json", jsondata, (err) => {});
        exec('createkey.exe', (err, data) =>{}); 
        exec('encrypt.exe', (err, data) =>{}); 
        verify.style.animation = 'fadeout 1s forwards';
        
        setTimeout(()=> {
            verify.style.display = 'none';
            window.location.href = 'verified.html';
        }, 2000);
    }else{
        var err = document.getElementById('errorv');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "Wrong code! Try again.";
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

async function sendMail(email){
    for (let i = 1; i <= 6; i++){
        twoFA += (Math.floor(Math.random() * 9)).toString(); //6 random values from 0-9
    }

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "MAIL",
          pass: "PASS",
        },
    });

    await transporter.sendMail({
        from: "MAIL",
        to: email,
        subject: "2FA code verification.",
        text: `Your code is: ${twoFA}`
    });
}