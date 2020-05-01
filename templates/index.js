const path = require("path");

module.exports = function (templatePath, data) {
  return new Promise(function (resolve, reject) {
    ejs.renderFile(
      path.join(process.cwd(), templatePath),
      data,
      options,
      function (err, str) {
        if (err) reject(err);
        else resolve(str);
      }
    );
  });
};
