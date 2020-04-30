const groupBy = require("lodash.groupby");
const apiInstance = require("../tmdb-api");

async function routes(fastify, options) {
  fastify.route({
    method: "GET",
    url: "/by-date/:date",
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

      return Promise.all(
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
    },
  });

  // create a schedule
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: {
        date: {
          type: "string",
        },
        time: {
          type: "string",
        },
        movieId: {
          type: "string",
        },
        cinemaId: {
          type: "string",
        },
        movieTypeId: {
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
    // preHandler: fastify.auth([fastify.verifyAdmin]),
    handler: async (request, reply) => {
      const { Schedule, Movie, Cinema, MovieType } = fastify.models;

      let movie = await Movie.findByPk(String(request.body.movieId));

      if (!movie) {
        const data = JSON.parse(
          (await apiInstance.movieDetails(String(request.body.movieId))).body
        );

        const youtubeId = await apiInstance.getTrailerForMovie(data.id)

        movie = await Movie.create({
          id: String(data.id),
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date,
          title: data.title,
          vote: data.vote_average,
          youtubeId
        });
        request.log.info(`[model] movie created -> ID: ${data.id}`);
      }

      const cinema = await Cinema.findByPk(request.body.cinemaId);
      const movieType = await MovieType.findByPk(request.body.movieTypeId);

      const schedule = await Schedule.create({
        date: request.body.date,
        time: request.body.time,
      });

      try {
        await schedule.setMovie(movie);
        await schedule.setCinema(cinema);

        await schedule.setMovieType(movieType);
        return schedule;
      } catch (err) {
        await schedule.destroy();
        return {
          error: err.errors.map(({ message, type, path }) => ({
            message,
            type,
            path,
          })),
          message: err.errors.map(({ message, type, path }) => ({
            message,
            type,
            path,
          })),
          statusCode: 400,
        };
      }
    },
  });
}

module.exports = routes;
