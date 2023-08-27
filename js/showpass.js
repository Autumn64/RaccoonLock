let json;
let keys = [];

const verify = document.getElementById('verify');
const container = document.getElementById('container');
const copied = document.getElementById('copied');
let theresData = true;

function main(){
    exec(raccoonstealer, ['-d', '-y', `${path}/data.rlc`], (error, stdout, stderr) => {
        if (error) window.location.href = `error.html?err=${encodeURIComponent(error)}`;
        if (stderr) window.location.href = `error.html?err=${encodeURIComponent(stderr)}`;
        try{
	        let jsonstring = paths.getCorrectJSON(stdout);
            json = JSON.parse(jsonstring);
        }catch(e){
            window.location.href = `error.html?err=${encodeURIComponent(e)}`;
        }
        verify.classList.remove('hidden');
        verify.style.display = 'flex';
        verify.style.animation = 'fadein 0.5s';
        for(let key in json){
            if (key === 'RaccoonLock') continue; //Ignores the app's password
            keys.push(key);
        }
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
		setData();
	}, 600);
});

document.getElementById('goback').addEventListener('click', () =>
    window.location.href = 'mainmenu.html');

document.getElementById('search').addEventListener('input', function (){
    let tablediv = document.getElementById('tablediv');
    tablediv.innerHTML = "";
    if (this.value.trim() === ""){
        setData();
    }else{
        searchData(this);
    }
});

const clearAllTimeouts = () =>{
    let highestTimeoutId = setTimeout(() =>{});
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i); 
    }
}

function searchData(search){
    let found = [];
    if (keys.length === 0){
        container.innerHTML += `${currentlang.container.nodata}.`;
        theresData = false;
    }
    if (theresData === true){
        keys.forEach(key =>{
            if (key.toLowerCase().includes(search.value.toLowerCase())) found.push(key);
        });
        found.sort();
        found.forEach(showData);
        addClick();
    }
}

function setData(){
    if (keys.length === 0){
        container.innerHTML += `${currentlang.container.nodata}.`;
        theresData = false;
    }
    if (theresData === true){
        keys.forEach(showData);
        addClick();
    }
}

function showData(key){ //Iterates for each service
    let table = document.createElement('table');
    let tablediv = document.getElementById('tablediv');
    table.className = 'stuff';
    tablediv.innerHTML += `<h2><u>${key}</u></h2>`; //Specifies the service
    for (let i = 0; i < json[key].user.length; i++){ //For each item in the "user" array
        let rowUser = table.insertRow();
        let cell1User = rowUser.insertCell();
        cell1User.innerHTML = currentlang.container.table.user;
        let cell2User = rowUser.insertCell();
        cell2User.innerHTML = `<input type="email" value="${json[key].user[i]}" class="data" tabindex="1" readonly>`;

        let rowPass = table.insertRow();
        let cell1Pass = rowPass.insertCell();
        cell1Pass.innerHTML = currentlang.container.table.password;
        let cell2Pass = rowPass.insertCell();
        cell2Pass.innerHTML = `<input type="password" value="${json[key].password[i]}" class="data" tabindex="1" readonly>`; //Password array works the same way
        // Add two empty rows after password row
        let emptyRow1 = table.insertRow();
        let emptyCell1 = emptyRow1.insertCell();
        emptyCell1.innerHTML = "<br>";
        let emptyRow2 = table.insertRow();
        let emptyCell2 = emptyRow2.insertCell();
        emptyCell2.innerHTML = "<br>";
    }
    tablediv.appendChild(table);
}

function addClick(){
    let allinps = Array.from(document.getElementsByClassName('data'));
    let verify = document.getElementById("verify");
    for(let i = 0; i < allinps.length; i++){
        allinps[i].addEventListener('click', () => {
		allinps[i].type = "text";
		copy(allinps[i].value)
	});
        allinps[i].addEventListener('keypress', event => {
		if(event.key === 'Enter'){
			allinps[i].type = "text";
			copy(allinps[i].value);
		}
	});
    }
}

function copy(text){
    clearAllTimeouts();
    navigator.clipboard.writeText(text);
    copied.classList.remove('hidden');
    copied.style.display = '';
    copied.style.animation = 'fadein 0.2s';
    setTimeout(() =>{
        copied.style.animation = 'fadeout 0.2s forwards';
    }, 3000);
    setTimeout(() => copied.style.display = 'none', 4000);
}
