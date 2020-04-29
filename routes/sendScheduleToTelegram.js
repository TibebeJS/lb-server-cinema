const groupBy = require("lodash.groupby");

async function routes(fastify, options) {
  fastify.route({
    method: "GET",
    url: "/:date",
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

      const schedulesForDay = await Promise.all(
        Object.entries(
          groupBy(
            await Schedule.findAll({
              where: { date: request.params.date },
              include: [Cinema, MovieType],
              field: ["date", "time", "id"],
            }),
            "MovieId"
          )
        ).map(async ([id, data]) => {
          return { ...(await Movie.findByPk(id)).toJSON(), schedules: data };
        })
      );
      // background: { r: 255, g: 0, b: 0, alpha: 0.5 }

      return {
        success: schedulesForDay,
      };
    },
  });
}

module.exports = routes;
