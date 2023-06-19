window.addEventListener('DOMContentLoaded', () =>{
    var verified = document.getElementById('verified');
    var container = document.getElementById('container');
    var start = document.getElementById('start');
    verified.classList.remove('hidden');
    verified.style.animation = 'fadein 1s';
    setTimeout(() => verified.style.animation = 'fadeout 1s forwards', 2000);
    setTimeout(() => verified.style.display = 'none', 3000);
    setTimeout(() =>{
        container.classList.remove('hidden');
        container.style.display = 'flex';
        container.style.animation = 'fadein 1.5s';
    }, 5000);
    setTimeout(() =>{
        container.style.animation = 'fadeout 1s forwards';
    }, 10000);
    setTimeout(() =>{
        container.style.display = 'none';
        start.classList.remove('hidden');
        start.style.animation = 'fadein 1s';
    }, 11000);
    setTimeout(() =>{
        start.style.animation = 'fadeout 1s forwards';
    }, 14000);
    setTimeout(() =>{
        start.style.display = 'none';
        window.location.href = 'mainmenu.html';
    }, 15000);
});