const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "gast-cinema.addis-dev.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: "verification@gast-cinema.addis-dev.com",
    pass: "#dyDmRyZAz$G",
  },
});
