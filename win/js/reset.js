const path = `${process.env.LOCALAPPDATA}/Raccoonlock`;
const fs = require('fs');

document.getElementById('accept').addEventListener('click', () =>{
    let text = document.getElementById('text');
    let buttons = document.getElementById('buttons');
    fs.rm(path, { recursive: true, force: true }, (err) =>{});
    text.style.animation = 'fadeout 1s forwards';
    buttons.style.animation ='fadeout 1s forwards';
    setTimeout(() =>{
        buttons.style.display = 'none';
        text.innerHTML = currentlang.text2;
        text.style.animation ='fadein 1s' ;
    }, 2000);
    setTimeout(() =>{
        text.style.animation = 'fadeout 1s forwards';
    }, 8000);
    setTimeout(() => window.location.href = 'index.html', 10000);
});

document.getElementById('cancel').addEventListener('click', () =>
    window.location.href = 'settings.html');