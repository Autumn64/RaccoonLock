const interfaces = require("./js/lang/interfaces.js");
const paths = new interfaces(process.platform);
const path = paths.getPath();
const fs = require('fs');

window.addEventListener('DOMContentLoaded', () => {
    let div = document.getElementById('starting');
    let container = document.getElementById('container');
    if(!fs.existsSync(`${path}/data.rlc`)){
        setTimeout(() => div.innerHTML += "<br>Preparing to start for the first time...", 5000);
        setTimeout(() => window.location.href = 'firstrun.html', 15000);
    }
    else{
        setTimeout(() => div.innerHTML += '<img src="res/spinner2.gif" class="img-loading">', 3000);
        setTimeout(() => container.style.animation = 'fadeout 1s forwards', 9000);
        setTimeout(() => window.location.href = 'login.html', 10000);
    }
});
