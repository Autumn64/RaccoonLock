const getPaths = require("./js/lang/getpaths.js");
const paths = new getPaths(process.platform);
const path = paths.getPath();
const fs = require('fs');

window.addEventListener('DOMContentLoaded', () => {
    let div = document.getElementById('starting');
    let container = document.getElementById('container');
    if(!fs.existsSync(`${path}/`)){
        setTimeout(() => div.innerHTML += "<br>Preparing to start for the first time...", 5000);
        setTimeout(() => window.location.href = 'firstrun.html', 15000);
    }
    else{
        if (fs.existsSync(`${path}/.key.key`)) fs.renameSync(`${path}/.key.key`, `${path}/key.key`);
        setTimeout(() => div.innerHTML += '<img src="res/spinner2.gif" class="img-loading">', 3000);
        setTimeout(() => container.style.animation = 'fadeout 1s forwards', 9000);
        setTimeout(() => window.location.href = 'login.html', 10000);
    }
});