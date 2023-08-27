function main(){
    let time = checkTime();
    let name;
    if ("index" in userinfo){
    	name = userinfo.name.trimStart().split(' ')[Number(userinfo.index)];
    }else{
    	name = userinfo.name.trimStart().split(' ')[0];
    }
    document.getElementById('logo').innerHTML += `<h2>${time}, ${name}.</h2>`
}

document.getElementById('settings').addEventListener('click', () =>{
    window.location.href = 'settings.html';
});

document.getElementById('passgen').addEventListener('click', () =>{
    window.location.href = 'passgenerator.html';
});

document.getElementById('showpass').addEventListener('click', () =>{
    window.location.href = 'showpass.html';
});

document.getElementById('logout').addEventListener('click', () =>{
    window.location.href = 'logout.html';
});

document.getElementById('editpass').addEventListener('click', () =>{
    let buttons = document.getElementById('buttons');
    let modify = document.getElementById('modify');
    let goback = document.getElementById('goback');
    let settings = document.getElementById('settings');
    let logout = document.getElementById('logout');

    buttons.style.animation = 'fadeout 0.5s forwards';
    settings.style.animation = 'fadeout 0.5s forwards';
    logout.style.animation = 'fadeout 0.5s forwards';
    setTimeout(() => {
        buttons.style.display = 'none'; //Hides buttons
        modify.classList.remove('hidden'); //Modify div
        modify.style.display = 'flex';
        modify.style.animation = 'fadein 0.5s';

        goback.classList.remove('hidden'); //Go back button
        goback.style.display = '';
        goback.style.animation = 'fadein 0.5s';
    }, 1000);
});

document.getElementById('addservice').addEventListener('click', () =>
    window.location.href = 'addservice.html');

document.getElementById('modifyservice').addEventListener('click', () =>{
    window.location.href = 'modifyservice.html?id=none&pass=true';
});

document.getElementById('goback').addEventListener('click', () =>{
    let buttons = document.getElementById('buttons');
    let modify = document.getElementById('modify');
    let goback = document.getElementById('goback');
    let settings = document.getElementById('settings');
    let logout = document.getElementById('logout');

    modify.style.animation = 'fadeout 0.5s forwards'; //Hides modify div
    goback.style.animation = 'fadeout 0.5s forwards';
    setTimeout(() => {
        modify.style.display = 'none';
        goback.style.display = 'none';
        buttons.style.display = 'flex'; //Shows buttons
        buttons.style.animation = 'fadein 0.5s';
        settings.style.display = '';
        settings.style.animation = 'fadein 0.5s';
        logout.style.display = '';
        logout.style.animation = 'fadein 0.5s';
    }, 1000);
});

function checkTime(){
    let currentTime = new Date().getHours();
    if (Number(currentTime) >= 6 && Number(currentTime) <= 11){
        return currentlang.morning;
    }else if (Number(currentTime) >= 12 && Number(currentTime) <= 18){
        return currentlang.afternoon;
    }else{
        return currentlang.evening;
    }
}
