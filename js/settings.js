const { ipcRenderer } = require('electron');
const fs = require("fs");
const sendMail = require('./js/sendmail.js');

let twoFA = "";
let passjson;
let askPassword = false;

function main(){
    document.getElementById('name').value = userinfo.name; //Get all the inputs
    document.getElementById('user').value = userinfo.user;
    document.getElementById('phone').value = userinfo.phone;
    document.getElementById('birthdate').value = userinfo.birthdate;
    setName();
    let passmode = document.getElementById('switch');
    exec(raccoonreader, ['-d', '-y', `${path}/data.rlc`], (error, stdout, stderr) => {
        if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
        if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
        try{
            let jsonstring = paths.getCorrectJSON(stdout);
            passjson = JSON.parse(jsonstring);
        }catch(e){
            window.location.href = `error.html?err=${encodeURIComponent(e)}`;
        }
        document.getElementById('password').value = passjson.RaccoonLock;
        document.getElementById('goback').classList.remove('hidden'); //Shows go back and about buttons
        document.getElementById('about').classList.remove('hidden');
    });
    userinfo.passwordmode === false ? passmode.checked = false : passmode.checked = true;
}

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
    let tmpnameindex = document.getElementById('nameindex').value;

    if(tmpname !== userinfo.name || tmpuser !== userinfo.user || tmpphone !== userinfo.phone
        || tmpbirthdate !== userinfo.birthdate || tmppassword !== passjson.RaccoonLock || tmplang !== userinfo.language || tmpnameindex !== userinfo.index){ //Super long condition but it's to check all values
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
            if(userinfo.language === 'kr') {
                document.getElementById('nowenter').innerHTML = `${tmpuser}${currentlang.verify.nowenter}`;
            }else{
                document.getElementById('nowenter').innerHTML = `${currentlang.verify.nowenter} ${tmpuser}`;
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
            document.getElementById('nowenter').innerHTML = `${currentlang.verify.newenter}`;
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

    if (askPassword === false && code.trim() === twoFA.trim() || askPassword === true && code === tmppassword){
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
        userinfo.passwordmode = false;
        successa.innerHTML = currentlang.info.sucessa[1];
    }else{
        userinfo.passwordmode = true;
        successa.innerHTML = currentlang.info.sucessa[0];
    }
    let newPassJSON = paths.makeCorrectJSON(JSON.stringify(passjson));
    let newJSON = paths.makeCorrectJSON(JSON.stringify(userinfo));
    exec(raccoonreader, ['-a', `${path}/data.rlc`, newPassJSON, newJSON], (error, stdout, stderr) =>{
	    if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
	    if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
    });
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

document.getElementById('backup').addEventListener('click', () =>{
    ipcRenderer.send('save-dialog');
});

ipcRenderer.on('save-dialog-closed', (event, filePath) => {
    if (filePath) {
        if (!filePath.endsWith(".rlc")){
            filePath = filePath + ".rlc";
        }
        let file = fs.readFileSync(`${path}/data.rlc`);
        try{
            fs.writeFileSync(filePath, file);
        }catch(e){
            ipcRenderer.send('backup-failure', currentlang.info["backup-failure"], e);
            return;
        }
        ipcRenderer.send('backup-success', currentlang.info["backup-success"], filePath);
    }
});

document.getElementById('restore').addEventListener('click', () =>{
    ipcRenderer.send('open-dialog');
});

ipcRenderer.on('open-dialog-closed', (event, filePath) =>{
    if (!filePath) return;

    if (!filePath.endsWith(".rlc")){
        ipcRenderer.send('backup-failure', "Error restoring backup!", "");
        return;
    }
    ipcRenderer.send('backup-success', "Backup restored successfully!","");
});

function setName(){
    let nameArray = userinfo.name.trimStart().split(' ');
    for (let i = 0; i < nameArray.length; i++){
	    let option = document.createElement("option");
	    option.value = `${i}`;
	    option.innerHTML = nameArray[i];
	    document.getElementById('nameindex').appendChild(option);
    }
    if ("index" in userinfo){
	    document.getElementById('nameindex').value = userinfo.index;
    }else{
	    document.getElementById('nameindex').value = "0";
    }
}

function sendm(email){
    const mail = new sendMail(email, currentlang.mailtext);
    twoFA = mail.send();
}

function updateJSON(){
    let resetName = false;
    if (document.getElementById('name').value.trimStart() !== userinfo.name) resetName = true;
    userinfo.name = document.getElementById('name').value.trimStart(); //Update new values
    userinfo.user = document.getElementById('user').value.trimStart();
    userinfo.phone = document.getElementById('phone').value.trimStart();
    userinfo.birthdate = document.getElementById('birthdate').value.trimStart();
    userinfo.language = document.getElementById('language').value;
    passjson.RaccoonLock = document.getElementById('password').value.trimStart();
    resetName == true ? userinfo.index = "0" : userinfo.index = document.getElementById('nameindex').value;

    let newJSON = paths.makeCorrectJSON(JSON.stringify(userinfo));
    let newPassJSON = paths.makeCorrectJSON(JSON.stringify(passjson));
    exec(raccoonreader, ["-a", `${path}/data.rlc`, newPassJSON, newJSON], (error, stdout, stderr) =>{
	    if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
	    if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
	    return;
    });
}
