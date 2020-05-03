const admin = require("../services/firebase-service");
const { notification, verification } = require("../services/email-service");

const templates = require("../templates");

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
      const user = await admin.auth().createUser({
        email: request.body.emailAddress,
        displayName: request.body.fullName,
        password: request.body.phoneNumber.replace("+251", "0"),
        phoneNumber: request.body.phoneNumber,
      });

      const emailVerificationLink = await admin
        .auth()
        .generateEmailVerificationLink(request.body.emailAddress);

      const mailOptions = {
        from: process.env.EMAIL_USERNAME_VERIFICATION,
        to: "tibebes.js@gmail.com",
        subject: "GAST Cinema Admin Access Verification",
        html: await templates.admin.generateVerificationEmailTemplate(
          user,
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
        return {
          success: true,
        };  
      } catch (error) {
        console.log(error);
        return {
          success: false
        };  
      }
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
        from: process.env.EMAIL_USERNAME_NOTIFICATION,
        to: user.email,
        subject: "GAST Cinema Admin Access revocation notification",
        html: await templates.admin.generateRevocationEmailTemplate(user),
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
