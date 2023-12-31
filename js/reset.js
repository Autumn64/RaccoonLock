const fs = require('fs');

let password;

function main(){
   exec(raccoonreader, ['-d', '-y', `${path}/data.rlc`], (error, stdout, stderr) =>{
	   if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
	   if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
	   try{
		let jsonstring = paths.getCorrectJSON(stdout);
		let json =JSON.parse(jsonstring);
		password = json.RaccoonLock;
	   }catch(e){
		   window.location.href = `error.html?err=${encodeURIComponent(e)}`;
	   }
	   verify.classList.remove('hidden');
	   verify.style.display = 'flex';
	   verify.style.animation = 'fadein 0.5s';
   });
}

document.getElementById('vsubmit').addEventListener('click', () =>{
	let pass = document.getElementById('vpass').value;
	let errorv = document.getElementById('errorv');

	if (pass !== password){
		errorv.classList.remove('hidden');
		return;
	}

	verify.style.animation = "fadeout 0.5s forwards";
	setTimeout(() =>{
		verify.style.display = 'none';
		text.classList.remove('hidden');
		buttons.classList.remove('hidden');
		text.style.display = 'flex';
		buttons.style.display = 'flex';
		text.style.animation = 'fadein 0.5s';
		buttons.style.animation = 'fadein 0.5s';
	}, 600);
});

document.getElementById('accept').addEventListener('click', () =>{
    let text = document.getElementById('text');
    let buttons = document.getElementById('buttons');
    fs.rm(path, { recursive: true, force: true }, (err) => {});
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
