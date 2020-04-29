async function routes(fastify, options) {
  // fetch all cinemas
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: {
        date: {
          type: "string",
        },
      },
      // response: {
      //     200: {
      //         type: 'array',
      //         items: 'schedule#'
      //     },
      // }
    },
    preHandler: async (request, reply) => {},
    handler: async (request, reply) => {
      const { Schedule, Movie, Cinema, MovieType } = fastify.models;

      // const schedules = await (Cinema.findAll({
      //     include: [
      //         // Movie,
      //         Movie
      //         // Cinema,
      //         // MovieType
      //     ],
      //     where: {
      //         Movies: {
      //             Schedule: {
      //                 id: 1
      //             }
      //         }
      //     }
      // }));

      // console.log(schedules);
      return await Cinema.findAll({
        include: [Schedule],
      });
    },
  });
}

module.exports = routes;
