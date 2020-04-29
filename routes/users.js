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
}

module.exports = routes;
