import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

const yourEmail = process.env.MAIL_USER;
const yourPass = process.env.MAIL_PASSWORD;
const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT;
const senderEmail = process.env.MAIL_SENDER_EMAIL;

/**
 * Send mail
 * @param {string} to 
 * @param {string} subject 
 * @param {string[html]} htmlContent 
 * @returns 
 */
const sendMail = (to, subject, link) => {

  let transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: true, // use SSL - TLS
    auth: {
      user: yourEmail,
      pass: yourPass,
    },
  });
  let mailOptions = {
    from: senderEmail,
    to: to,
    subject: subject,
    html: link,
  };

  return transporter.sendMail(mailOptions); // promise
};

export default sendMail;