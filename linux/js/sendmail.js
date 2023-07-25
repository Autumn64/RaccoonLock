const nodemailer = require('nodemailer');

class sendMail{
    constructor(email, mailtext){
        this.email = email;
        this.mailtext = mailtext;
    }

    send(){
        let twoFA = "";

        for (let i = 1; i <= 6; i++){
            twoFA += (Math.floor(Math.random() * 10)).toString();
        }
    
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "USER",
              pass: "PASSWORD",
            },
        });
    
        transporter.sendMail({
            from: "USER",
            to: this.email,
            subject: "2FA code verification.",
            text: `${this.mailtext} ${twoFA}`
        });

        return twoFA;
    }
}

module.exports = sendMail;