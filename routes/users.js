const admin = require("../services/firebase-service");
const emailService = require("../services/email-service");
const path = require("path");

const fs = require("fs");
const fsPromise = fs.promises;

const generateAdminEmailVerification = async (name, verificationLink) => {
  const template = await fsPromise.readFile(
    path.join(__dirname, "../templates/email/admin/verify-email.html"),
    {
      encoding: 'utf-8'
    }
  );
  return template
    .replace("{{emailVerificationLink}}", verificationLink)
    .replace("{{name}}", name);
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

      await new Promise((resolve, reject) => {
        emailService.sendMail(mailOptions, function (err, info) {
          if (err) reject(err);
          else resolve(info);
        });
      });

      return {
        success: true,
      };
    },
  });
}

module.exports = routes;
