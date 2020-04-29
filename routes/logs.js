const { Op } = require("sequelize");
const httpErrors = require("http-errors");
const moment = require("moment");
const fs = require("fs");
const fsPromise = fs.promises;

async function routes(fastify, options) {
  // movies now-showing
  fastify.route({
    method: "GET",
    url: "/all",
    schema: {
      querystring: {
        // query: {
        //     type: 'string'
        // }
      },
      //   response: {
      //     200: {
      //       type: "array",
      //       items: "movie#",
      //     },
      //   },
    },
    preHandler: fastify.auth([fastify.verifyAdmin]),
    handler: async (request, reply) => {
      const logs = await fsPromise.readFile("./logs.log");
      const lines = logs.toString().split("\n");
      return lines.map((x) => {
        try {
          return JSON.parse(x);
        } catch (error) {
          return x;
        }
      });
    },
  });
}

module.exports = routes;
