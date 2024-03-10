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

window.addEventListener('DOMContentLoaded', () =>{
    let verified = document.getElementById('verified');
    let container = document.getElementById('container');
    let start = document.getElementById('start');
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