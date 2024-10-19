const nodemailer = require('nodemailer');


const sendEmail = async (options) => {
 
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: 587, 
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

 
  const mailOpts = {
    from: `"Lynkus" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };


  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
