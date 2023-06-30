const nodemailer = require('nodemailer');

function sendEmail(subject, text, to) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.emailsmtp || '',
            pass: process.env.passsmtp || ''
        }
    });

    const mailOptions = {
        from: process.env.emailsmtp || '',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendEmail };