const json = require('C:/RaccoonLock/info.json');
const fs = require('fs');
const nodemailer = require('nodemailer');
var exec = require('child_process').execFile;

var twoFA = "";
var passjson;

window.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('name').value = json.name; //Get all the inputs
    document.getElementById('user').value = json.user;
    document.getElementById('phone').value = json.phone;
    document.getElementById('birthdate').value = json.birthdate;
    var passmode = document.getElementById('switch');
    exec('decrypt.exe', ['--acceptdecrypt'], (error, data) => {
        getPass();
    });
    json.passwordmode === false ? passmode.checked = false : passmode.checked = true;
});

document.getElementById('save').addEventListener('click', () =>{
    var change;

    var info = document.getElementById('info'); //Divs
    var verify = document.getElementById('verify');

    var tmpname = document.getElementById('name').value; //New values
    var tmpuser = document.getElementById('user').value;
    var tmpphone = document.getElementById('phone').value;
    var tmpbirthdate = document.getElementById('birthdate').value;
    var tmppassword = document.getElementById('password').value;

    if(tmpname !== json.name || tmpuser !== json.user || tmpphone !== json.phone
        || tmpbirthdate !== json.birthdate || tmppassword !== passjson.RaccoonLock){ //Super long condition but it's to check all values
            change = true;
    }
    if(tmpname.trim() === "" || tmpuser.trim() === "" || tmppassword.trim() === ""){
        var err = document.getElementById('error');
        err.classList.remove('hidden');
        err.innerHTML = "Enter at least a name, an e-mail address and a password.";
        change = false;
    }
    if(change === true){
        info.style.animation = 'fadeout 0.5s forwards';
        info.style.display = 'none';
        setTimeout(() =>{
            verify.classList.remove('hidden');
            verify.style.display = 'flex';
            verify.style.animation = 'fadein 0.5s';
            document.getElementById('nowenter').innerHTML = `Enter the code that was sent to <br>${tmpuser}.`
        }, 1000);
        sendMail(tmpuser);
    }
});

document.getElementById('submitv').addEventListener('click', () =>{
    var code = document.getElementById('code').value;
    var verify = document.getElementById('verify');
    var err = document.getElementById('errorv');
    var password = document.getElementById('password').value;

    if (code === twoFA || code === password){
        var success = document.getElementById('success');
        err.style.display = 'none';
        success.classList.remove('hidden');
        document.getElementById('goback').style.display = 'none';
        document.getElementById('about').style.display = 'none';
        updateJSON();
        setTimeout(() => verify.style.animation = 'fadeout 1s forwards', 2000);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }else{
        err.classList.remove('hidden');
        err.innerHTML = "Wrong code! Try again.";
    }
});

document.getElementById('switch').addEventListener('click', () =>{ //Password mode switch
    var passmode = document.getElementById('switch');
    var successa = document.getElementById('successa');
    if (passmode.checked === false){
        json.passwordmode = false;
        let newJSON = JSON.stringify(json);
        fs.writeFileSync("C:/RaccoonLock/info.json", newJSON, (err) =>{});
        successa.classList.remove('hidden');
        successa.innerHTML = "Password mode deactivated.";
    }else{
        json.passwordmode = true;
        let newJSON = JSON.stringify(json);
        fs.writeFileSync("C:/RaccoonLock/info.json", newJSON, (err) =>{});
        successa.classList.remove('hidden');
        successa.innerHTML = "Password mode activated.<br>Warning: Password mode is unsecure! Use it only if you can't receive 2FA codes.";
    }
});

document.getElementById('reset').addEventListener('click', () =>
    window.location.href = 'reset.html');

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'mainmenu.html');

document.getElementById('about').addEventListener('click', () =>
    window.location.href = 'about.html');

document.getElementById('gobackl').addEventListener('click', () =>{
    const info = document.getElementById('info');
    const verify = document.getElementById('verify');
    verify.style.animation = 'fadeout 0.5s';
    verify.style.display = 'none';
    twoFA = "";
    document.getElementById('error').innerHTML = "";
    document.getElementById('errorv').innerHTML = "";
    setTimeout(()=>{
        info.style.animation = 'fadein 0.5s';
        info.style.display = 'flex';
    }, 1000);
});

document.getElementById('toggletheme').addEventListener('click', () =>{ //Toggle theme button
    const currentstyle = fs.readFileSync('C:/RaccoonLock/styles.css', 'utf-8'); //Stores current theme
    const newstyle = fs.readFileSync('C:/RaccoonLock/otherstyles.css', 'utf-8'); //Stores new theme

    fs.writeFileSync('C:/RaccoonLock/styles.css', newstyle, (err) => {}); //Sets new styles to the file
    fs.writeFileSync('C:/RaccoonLock/otherstyles.css', currentstyle, (err) => {}); //Sets old styles to the file
    window.location.href = 'settings.html'; //Update webpage
})

function getPass(){
    passjson = JSON.parse(fs.readFileSync('C:/RaccoonLock/data.json', 'utf8'));
    exec('encrypt.exe', (error, data) => {});
    document.getElementById('password').value = passjson.RaccoonLock;
    document.getElementById('goback').classList.remove('hidden'); //Shows go back and about buttons
    document.getElementById('about').classList.remove('hidden');
}

async function sendMail(email){
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
    try{
        await transporter.sendMail({
            from: "MAIL",
            to: email,
            subject: "2FA code verification.",
            text: `Your code is: ${twoFA}`
        });
    }catch(e){
    }
}

function updateJSON(){
    json.name = document.getElementById('name').value.trimStart(); //Update new values
    json.user = document.getElementById('user').value.trimStart();
    json.phone = document.getElementById('phone').value.trimStart();
    json.birthdate = document.getElementById('birthdate').value.trimStart();
    passjson.RaccoonLock = document.getElementById('password').value.trimStart();

    var newJSON = JSON.stringify(json);
    var newPassJSON = JSON.stringify(passjson)
    fs.writeFileSync("C:/RaccoonLock/info.json", newJSON, (err) =>{});
    fs.writeFileSync("C:/RaccoonLock/data.json", newPassJSON, (err) => {});
    exec('encrypt.exe', (err, data) =>{});
}