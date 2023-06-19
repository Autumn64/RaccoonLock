document.getElementById('goback').addEventListener('click', () => //Go back button
    window.location.href = 'mainmenu.html');

document.getElementById('generate').addEventListener('click', () =>{ //Generar button
    var pass = document.getElementById('pass');
    var selection = document.getElementById('pass_size').value;
    const charset = "!#$%?*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%?*0123456789"
    pass.innerHTML = "";
    for (let i = 1; i <= Number(selection); i++){
        pass.innerHTML += charset.charAt(Math.floor(Math.random() * charset.length)); //Get random index
    }
});

document.getElementById('pass').addEventListener('click', () =>{ //Pass div
    var pass = document.getElementById('pass');
    var copied = document.getElementById('copied');
    if (pass.innerHTML !== '&nbsp;'){
        navigator.clipboard.writeText(pass.innerHTML);
        copied.classList.remove('hidden');
        copied.style.display = '';
        copied.style.animation = 'fadein 0.2s';
        setTimeout(() =>{
            copied.style.animation = 'fadeout 0.2s forwards';
        }, 3000);
        setTimeout(() => copied.style.display = 'none', 4000);
    }
});