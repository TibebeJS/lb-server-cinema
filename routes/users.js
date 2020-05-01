const admin = require("../services/firebase-service");
const { notification, verification } = require("../services/email-service");
const path = require("path");

const fs = require("fs");
const fsPromise = fs.promises;

const generateAdminEmailVerification = async (name, verificationLink) => {
  const template = await fsPromise.readFile(
    path.join(__dirname, "../templates/email/admin/verify-email.html"),
    {
      encoding: "utf-8",
    }
  );
  return template
    .replace("{{emailVerificationLink}}", verificationLink)
    .replace("{{name}}", name);
};

const generateAdminDeleteNotification = async (user) => {
  const template = await fsPromise.readFile(
    path.join(
      __dirname,
      "../templates/email/admin/admin-access-revocation.html"
    ),
    {
      encoding: "utf-8",
    }
  );
  return template.replace("{{name}}", user.displayName);
};

async function routes(fastify, options) {
  fastify.route({
    method: "GET",
    url: "/all",
    // schema: {
    //   querystring: {
    // query: {
    //     type: 'string'
    // }
    //   },
    //   response: {
    //     200: {
    //       type: "array",
    //       items: "movie#",
    //     },
    //   },
    // },
    preHandler: fastify.auth([fastify.verifyAdmin]),
    handler: async (request, reply) => {
      const listUsersResult = await admin.auth().listUsers();

      return listUsersResult.users;
    },
  });

  fastify.route({
    method: "POST",
    url: "/create-user",
    schema: {
      body: {
        emailAddress: {
          type: "string",
        },
        fullName: {
          type: "string",
        },
        phoneNumber: {
          type: "string",
        },
      },
    },
    preHandler: fastify.auth([fastify.verifyAdmin]),
    handler: async (request, reply) => {
      await admin.auth().createUser({
        email: request.body.emailAddress,
        displayName: request.body.fullName,
        password: request.body.phoneNumber.replace("+251", "0"),
        phoneNumber: request.body.phoneNumber,
      });

      const emailVerificationLink = await admin
        .auth()
        .generateEmailVerificationLink(request.body.emailAddress);

      const mailOptions = {
        from: "verification@gast-cinema.addis-dev.com", // sender address
        to: "tibebes.js@gmail.com", // list of receivers
        subject: "GAST Cinema Admin Access Verification", // Subject line
        html: await generateAdminEmailVerification(
          request.body.fullName,
          emailVerificationLink
        ),
      };

      try {
        await new Promise((resolve, reject) => {
          verification.sendMail(mailOptions, function (err, info) {
            if (err) reject(err);
            else resolve(info);
          });
        });
      } catch (error) {
        console.log(error);
      }
      return {
        success: true,
      };
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/:uid",
    schema: {},
    preHandler: fastify.auth([fastify.verifyAdmin]),
    handler: async (request, reply) => {
      const user = await admin.auth().getUser(request.params.uid);

      await admin.auth().deleteUser(request.params.uid);

      const mailOptions = {
        from: "notification@gast-cinema.addis-dev.com",
        to: user.email,
        subject: "GAST Cinema Admin Access revocation notification",
        html: await generateAdminDeleteNotification(user),
      };

      try {
        await new Promise((resolve, reject) => {
          notification.sendMail(mailOptions, function (err, info) {
            if (err) reject(err);
            else resolve(info);
          });
        });
      } catch (error) {
        console.log(error);
      }

      return {
        success: true,
      };
    },
  });
}

module.exports = routes;
