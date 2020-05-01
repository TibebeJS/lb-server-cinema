const path = require("path");
const ejs = require("ejs");

function render(templatePath, data) {
  return new Promise(function (resolve, reject) {
    ejs.renderFile(path.join(__dirname, templatePath), data, options, function (
      err,
      str
    ) {
      if (err) reject(err);
      else resolve(str);
    });
  });
}

module.exports = {
  admin: {
    async generateVerificationEmailTemplate(user, emailVerificationLink) {
      return await render("admin/verification-email.ejs", {
        user,
        emailVerificationLink,
      });
    },
    async generateRevocationEmailTemplate(user) {
      return await render("admin/revocation-email.ejs", {
        user,
      });
    },
  },
};
