const path = `${os.homedir()}/.raccoonlock`;
const json = require(`${path}/info.json`);
const fs = require('fs');
const sendMail = require('./js/sendmail.js')
let exec = require('child_process').execFile;

let twoFA = "";
let passjson;
let askPassword = false;

window.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('name').value = json.name; //Get all the inputs
    document.getElementById('user').value = json.user;
    document.getElementById('phone').value = json.phone;
    document.getElementById('birthdate').value = json.birthdate;
    let passmode = document.getElementById('switch');
    exec('./raccoonstealer', ['--decrypt', '--acceptdecrypt'], (error, data) => {
        getPass();
    });
    json.passwordmode === false ? passmode.checked = false : passmode.checked = true;
});

document.getElementById('save').addEventListener('click', () =>{
    let change;
    let info = document.getElementById('info'); //Divs
    let verify = document.getElementById('verify');
    let tmpname = document.getElementById('name').value; //New values
    let tmpuser = document.getElementById('user').value;
    let tmpphone = document.getElementById('phone').value;
    let tmpbirthdate = document.getElementById('birthdate').value;
    let tmppassword = document.getElementById('password').value;
    let passwordmode = document.getElementById('switch').checked;
    let tmplang = document.getElementById('language').value;

    if(tmpname !== json.name || tmpuser !== json.user || tmpphone !== json.phone
        || tmpbirthdate !== json.birthdate || tmppassword !== passjson.RaccoonLock || tmplang !== json.language){ //Super long condition but it's to check all values
            change = true;
    }
    if(tmpname.trim() === "" || tmpuser.trim() === "" || tmppassword.trim() === ""){
        let err = document.getElementById('error');
        err.classList.remove('hidden');
        err.innerHTML = currentlang.info.error;
        change = false;
    }
    if(change === true && passwordmode === false){
        askPassword = false;
        info.style.animation = 'fadeout 0.5s forwards';
        info.style.display = 'none';
        setTimeout(() =>{
            verify.classList.remove('hidden');
            verify.style.display = 'flex';
            verify.style.animation = 'fadein 0.5s';
            document.getElementById('code').placeholder = currentlang.verify.code[0];
            document.getElementById('errorv').style.display = 'none';
            document.getElementById('errorv').innerHTML = currentlang.verify.errorv[0];
            if(json.language === 'kr') {
                document.getElementById('nowenter').innerHTML = `${tmpuser}${currentlang.verify.nowenter}.`;
            }else{
                document.getElementById('nowenter').innerHTML = `${currentlang.verify.nowenter} ${tmpuser}.`;
            }
        }, 1000);
        sendm(tmpuser);
    }
    if (change === true && passwordmode === true){
        askPassword = true;
        info.style.animation = 'fadeout 0.5s forwards';
        info.style.display = 'none';
        setTimeout(() =>{
            verify.classList.remove('hidden');
            verify.style.display = 'flex';
            verify.style.animation = 'fadein 0.5s';
            document.getElementById('nowenter').innerHTML = `${currentlang.verify.newenter}.`;
            document.getElementById('code').type = 'password';
            document.getElementById('code').placeholder = currentlang.verify.code[1];
            document.getElementById('errorv').style.display = 'none';
            document.getElementById('errorv').innerHTML = currentlang.verify.errorv[1];
        }, 1000);
    }
});

document.getElementById('submitv').addEventListener('click', () =>{
    let code = document.getElementById('code').value;
    let verify = document.getElementById('verify');
    let err = document.getElementById('errorv');
    let tmppassword = document.getElementById('password').value;
    let submitv = document.getElementById('submitv');
    let gobackl = document.getElementById('gobackl');

    if (askPassword === false && code === twoFA || askPassword === true && code === tmppassword){
        let success = document.getElementById('success');
        err.style.display = 'none';
        success.classList.remove('hidden');
        document.getElementById('goback').style.animation = 'fadeout 0.5s forwards';
        document.getElementById('about').style.animation = 'fadeout 0.5s forwards';
        submitv.style.animation = 'fadeout 0.5s forwards';
        gobackl.style.animation = 'fadeout 0.5s forwards';
        updateJSON();
        setTimeout(() => verify.style.animation = 'fadeout 1s forwards', 2000);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }else{
        err.classList.remove('hidden');
        err.style.display = '';
    }
});

document.getElementById('switch').addEventListener('click', () =>{ //Password mode switch
    let passmode = document.getElementById('switch');
    let successa = document.getElementById('successa');
    if (passmode.checked === false){
        json.passwordmode = false;
        successa.innerHTML = currentlang.info.sucessa[1];
    }else{
        json.passwordmode = true;
        successa.innerHTML = currentlang.info.sucessa[0];
    }
    let newJSON = JSON.stringify(json);
    fs.writeFileSync(`${path}/info.json`, newJSON, (err) =>{});
    successa.classList.remove('hidden');
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

function getPass(){
    passjson = JSON.parse(fs.readFileSync(`${path}/data.json`, 'utf8'));
    exec('./raccoonstealer', ['--encrypt'], (err, data) =>{});
    document.getElementById('password').value = passjson.RaccoonLock;
    document.getElementById('goback').classList.remove('hidden'); //Shows go back and about buttons
    document.getElementById('about').classList.remove('hidden');
}

function sendm(email){
    const mail = new sendMail(email, currentlang.mailtext);
    twoFA = mail.send();
}

function updateJSON(){
    json.name = document.getElementById('name').value.trimStart(); //Update new values
    json.user = document.getElementById('user').value.trimStart();
    json.phone = document.getElementById('phone').value.trimStart();
    json.birthdate = document.getElementById('birthdate').value.trimStart();
    json.language = document.getElementById('language').value;
    passjson.RaccoonLock = document.getElementById('password').value.trimStart();

    let newJSON = JSON.stringify(json);
    let newPassJSON = JSON.stringify(passjson)
    fs.writeFileSync(`${path}/info.json`, newJSON, (err) =>{});
    fs.writeFileSync(`${path}/data.json`, newPassJSON, (err) => {});
    exec('./raccoonstealer', ['--encrypt'], (err, data) =>{});
}