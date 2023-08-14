const sendMail = require('./js/sendmail.js');

let twoFA = "";
let passjson = "";
let email;
let passwordd = document.getElementById('passwordd');

function main(){
	exec(raccoonstealer, ['-d', '-y', `${path}/data.rlc`], (error, stdout, stderr) => {
		if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
        if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
        let jsonstring = paths.getCorrectJSON(stdout);
        let data = JSON.parse(jsonstring);
       	passjson = data.RaccoonLock;
        passwordd.classList.remove('hidden');
        passwordd.style.animation = 'fadein 0.5s';
    });
	email = userinfo.user;
}

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
            userinfo.passwordmode === false ? sendm() : window.location.href = 'mainmenu.html';
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
    if(userinfo.language === 'kr') {
        document.getElementById('message').innerHTML = `${email}${currentlang.verify.message}.`;
    }else{
        document.getElementById('message').innerHTML = `${currentlang.verify.message} ${email}.`;
    }
    
    const mail = new sendMail(email, currentlang.mailtext);
    twoFA = mail.send();
}
