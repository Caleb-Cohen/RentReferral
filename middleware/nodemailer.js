// Nodemailer
const nodemailer = require("nodemailer")

module.exports = {
    mainMail: async function(name, email, message, postersEmail) {
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
            type: 'OAuth2',
            user: process.env.user,
            pass: process.env.pass,
            clientId: process.env.clientId,
            clientSecret: process.env.clientSecret,
            refreshToken: process.env.refreshToken
            }
        });

        let mailOption = {
            from: process.env.user,
            to: postersEmail,
            subject: "A Potential Renter Has Reached Out To You",
            html: `You've got a message from: 
            Name: ${name}
            Email : ${email}
            Message: ${message}`,
        };

        transporter.sendMail(mailOption, function(err, data) {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully");
            }
          });
    }
}