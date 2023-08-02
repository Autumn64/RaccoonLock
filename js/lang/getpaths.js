class getPaths{
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
}

module.exports = getPaths;
