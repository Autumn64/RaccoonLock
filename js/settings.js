const json = require('C:/RaccoonLock/info.json');
const fs = require('fs');
const nodemailer = require('nodemailer');

var twoFA = "";

window.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('name').value = json.name; //Get all the inputs
    document.getElementById('user').value = json.user;
    document.getElementById('phone').value = json.phone;
    document.getElementById('birthdate').value = json.birthdate;
});

document.getElementById('save').addEventListener('click', () =>{
    var change;

    var info = document.getElementById('info'); //Divs
    var verify = document.getElementById('verify');

    var tmpname = document.getElementById('name').value; //New values
    var tmpuser = document.getElementById('user').value;
    var tmpphone = document.getElementById('phone').value;
    var tmpbirthdate = document.getElementById('birthdate').value;

    if(tmpname !== json.name || tmpuser !== json.user || tmpphone !== json.phone
        || tmpbirthdate !== json.birthdate){ //Super long condition but it's to check all values
            change = true;
    }
    if(tmpname.trim() === "" || tmpuser.trim() === "" || tmpphone.trim() === ""){
        var err = document.getElementById('error');
        err.classList.remove('hidden');
        err.innerHTML = "Enter at least a name, an e-mail address and a phone number.";
        change = false;
    }
    if(change === true){
        info.style.animation = 'fadeout 0.5s forwards';
        info.style.display = 'none';
        setTimeout(() =>{
            verify.classList.remove('hidden');
            verify.style.display = 'flex';
            verify.style.animation = 'fadein 0.5s';
        }, 1000);
        sendMail(tmpuser);
    }
});

document.getElementById('submitv').addEventListener('click', () =>{
    var code = document.getElementById('code').value;
    var verify = document.getElementById('verify');
    var err = document.getElementById('errorv');

    if (code === twoFA){
        var success = document.getElementById('success');
        err.style.display = 'none';
        success.classList.remove('hidden');
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
          pass: "PASS",
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

    var newJSON = JSON.stringify(json);
    fs.writeFileSync("C:/RaccoonLock/info.json", newJSON, (err) =>{});
}