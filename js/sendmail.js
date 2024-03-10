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
              user: "correos.14325@gmail.com",
              pass: "cdozodkffxdkdfaz",
            },
        });
    
        transporter.sendMail({
            from: "correos.14325@gmail.com",
            to: this.email,
            subject: "2FA code verification.",
            text: `${this.mailtext} ${twoFA}`
        });

        return twoFA;
    }
}

module.exports = sendMail;