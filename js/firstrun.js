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
    var password = document.getElementById('password').value;
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
        sendMail(email);
    }else{
        var err = document.getElementById('error');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "Enter the requested data.";
    }
});

document.getElementById('submitv').addEventListener('click', () =>{ //Verificar button
    var password = document.getElementById('password').value;
    var code = document.getElementById('code').value;
    var verify = document.getElementById('verify');
    var userWrotePassword;
    if (code === twoFA || code === password){
        userWrotePassword = code === password ? true : false;
        fs.mkdirSync("C:/RaccoonLock/");
        var info = {
            name: document.getElementById('name').value.trimStart(),
            user: document.getElementById('email').value.trimStart(),
            phone: "",
            birthdate: "",
            passwordmode: false
        };
        var data = {
            RaccoonLock: document.getElementById('password').value.trimStart()
        };
        var json = JSON.stringify(info);
        var jsondata = JSON.stringify(data);
        fs.writeFileSync("C:/RaccoonLock/info.json", json, (err) =>{});
        fs.writeFileSync("C:/RaccoonLock/data.json", jsondata, (err) => {});
        exec('createkey.exe', (err, data) =>{}); 
        exec('encrypt.exe', (err, data) =>{}); 
        const currentstyle = fs.readFileSync('./styles.css', 'utf-8');
        const newstyle = fs.readFileSync('./otherstyles.css', 'utf-8');
        const font = fs.readFileSync('./Raleway-SemiBold.ttf');
        fs.writeFileSync("C:/RaccoonLock/styles.css", currentstyle, (err) =>{}); //Creates dark theme
        fs.writeFileSync("C:/RaccoonLock/otherstyles.css", newstyle, (err) =>{}); //Creates clear theme
        fs.writeFileSync("C:/RaccoonLock/Raleway-SemiBold.ttf", font, (err) => {}); //Creates font
    }else{
        var err = document.getElementById('errorv');
        err.classList.remove('hidden'); //Shows error
        err.innerHTML = "Wrong code! Try again.";
    }
    if (userWrotePassword === true){ //If user typed the password instead of the code
        document.getElementById('success').classList.remove('hidden');
        var err = document.getElementById('errorv');
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