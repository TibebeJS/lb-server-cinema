const admin = require("../firebase-service");
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
        }
      },
    },
    preHandler: fastify.auth([fastify.verifyAdmin]),
    handler: async (request, reply) => {
      await admin.auth().createUser({
        email: request.body.emailAddress,
        displayName: request.body.fullName,
        password: '12345678',
        phoneNumber: request.body.phoneNumber
      });
      return {
        success: true
      }
    },
  });
}

module.exports = routes;
