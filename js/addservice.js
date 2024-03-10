/*
Copyright (c) 2023-2024, Mónica Gómez (Autumn64)

RaccoonLock is free software: you can redistribute it and/or modify it 
under the terms of the GNU General Public License as published by 
the Free Software Foundation, either version 3 of the License, or 
(at your option) any later version.

RaccoonLock is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
General Public License for more details.

You should have received a copy of the GNU General Public License 
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

let json;
let container = document.getElementById('container');
let neww = document.getElementById('neww');
let verify = document.getElementById('verify');

function main(){
    exec(raccoonreader, ['-d', '-y', `${path}/data.rlc`], (error, stdout, stderr) => {
        if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
        if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
        let other = document.getElementById('other');
        try{
            let jsonstring = paths.getCorrectJSON(stdout);
            json = JSON.parse(jsonstring);
        }catch(e){
            window.location.href = `error.html?err=${encodeURIComponent(e)}`;
        }
        verify.classList.remove('hidden');
        verify.style.display = 'flex';
        verify.style.animation = 'fadein 0.5s';
        let buttons = Array.from(document.getElementsByClassName('picbtn')); //Gets all buttons
        for (let i = 0; i < buttons.length ; i++){
            buttons[i].addEventListener('click', () => checkIfExists(buttons[i].id));
        }
        other.addEventListener('click', () => createNew('')); //'Add other' button
    });
}

document.getElementById('vsubmit').addEventListener('click', () =>{
	let pass = document.getElementById('vpass').value;
	let errorv = document.getElementById('errorv');

	if (pass !== json.RaccoonLock){
		errorv.classList.remove('hidden');
		return;
	}

	verify.style.animation = "fadeout 0.5s forwards";
	setTimeout(() =>{
		verify.style.display = 'none';
		container.classList.remove('hidden');
		container.style.display = 'flex';
		container.style.animation = 'fadein 0.5s';
	}, 600);
});


document.getElementById('goback').addEventListener('click', () => //Go back button
    window.location.href = 'mainmenu.html');

document.getElementById('submit').addEventListener('click', addData); //Submit button

function checkIfExists(id){
    for(let key in json){
        if (id.toLowerCase() === key.toLowerCase()){ //If it exists send to modify service page
            let location = `modifyservice.html?id=${encodeURIComponent(key)}&pass=false`;
            window.location.href = location;
        }else{
            createNew(id); //Pass id
        }
    }
    if (Object.keys(json).length === 0){ //If there's no values in the json
        createNew(id);
    }
}

function createNew(id){
    let service = document.getElementById('service'); //Service input
    container.style.animation = 'fadeout 0.5s forwards';
    setTimeout(() => container.style.display = 'none', 500);
    setTimeout(() =>{
        neww.classList.remove('hidden');
        neww.style.display = 'flex';
        neww.style.animation = 'fadein 0.5s';
        service.value = id;
    }, 1000);
}

function addData(){
    let service = document.getElementById('service').value; //Service input
    let user = document.getElementById('user').value; //User input
    let password =document.getElementById('password').value; //Password input
    let error = document.getElementById('error') //Error message
    let success = document.getElementById('success') //Success message

    for(let key in json){
        if (service.toLowerCase() === key.toLowerCase()){
            error.classList.remove('hidden'); //Shows error message
            error.innerHTML = currentlang.neww.error[0];
            return;
        }
    }

    if (service.trim() !== '' && user.trim() !== '' && password.trim() !== ''){
        document.getElementById("submit").style.animation = "fadeout 0.5s forwards";
        error.style.display = 'none'; //Hides error message
        success.classList.remove('hidden'); //Shows success message
        let new_JSON = {[service]: {user: [], password: []}, ...json} //Creates new key at the beginning
        new_JSON[service].user.push(user);
        new_JSON[service].password.push(password);
	    let newJSON = paths.makeCorrectJSON(JSON.stringify(new_JSON));
	    let newINFO = paths.makeCorrectJSON(JSON.stringify(userinfo));
        document.getElementById('goback').style.display = 'none'; //Hide back button
	
	    exec(raccoonreader, ["-a", `${path}/data.rlc`, newJSON, newINFO], (error, stdout, stderr) =>{
	        if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
	        if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
	        return;
    	});
        setTimeout(() =>{
            neww.style.animation = 'fadeout 0.5s forwards'; //Hide neww div
        }, 3000);
        setTimeout(() => window.location.href = 'showpass.html', 5000); //Go to showpass
    }else{
        error.classList.remove('hidden'); //Shows error message
        error.innerHTML = currentlang.neww.error[1];
    }
}
