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

class Interfaces{
    /*
    Depending on the platform, RaccoonReader (which was made in C) might have some issues to read Unicode
    characters outside the basic ASCII table, so I prefer to encode everything as a URI Component so all the
    information gets written and read correctly.
    */
    static decodeJSON(string){
        let jsonOnly = decodeURIComponent(string);
        let last = jsonOnly.lastIndexOf('}');
        if (last === -1) return `${string} is not a valid JSON string`;
        return jsonOnly.substring(0, last + 1);
    }

    static encodeJSON(string){
        let newString = encodeURIComponent(string);
        return newString;
    }

    static getPath(){
        if (process.platform === "win32"){
            let path = `${process.env.LOCALAPPDATA}\\Raccoonlock`;
            return path;
        }else{
            const os = require("os");
            let path = `${os.homedir()}/.raccoonlock`;
            return path;
        }
    }

    static getReader(){
		if (this.platform === "win32"){
			return 'raccoonreader.exe';
		}else if(this.platform === "linux"){
			return './raccoonreader';
		}
	}
}

module.exports = Interfaces;