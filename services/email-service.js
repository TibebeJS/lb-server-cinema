const nodemailer = require("nodemailer");

module.exports = {
  verification: nodemailer.createTransport({
    host: process.env.EMAIL_HOST_VERIFICATION,
    port: process.env.EMAIL_PORT_VERIFICATION,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME_VERIFICATION,
      pass: process.env.EMAIL_PASSWORD_VERIFICATION,
    },
  }),
  notification: nodemailer.createTransport({
    host: process.env.EMAIL_HOST_NOTIFICATION,
    port: process.env.EMAIL_PORT_NOTIFICATION,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME_NOTIFICATION,
      pass: process.env.EMAIL_PASSWORD_NOTIFICATION,
    },
  }),
};
