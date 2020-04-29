const groupBy = require("lodash.groupby");
const apiInstance = require("../tmdb-api");

async function routes(fastify, options) {
  // // returns all schedule for a given day
  // fastify.route({
  //   method: "GET",
  //   url: "/",
  //   schema: {
  //     querystring: {
  //       date: {
  //         type: "string",
  //       },
  //     },
  //     // response: {
  //     //     200: {
  //     //         type: 'array',
  //     //         items: 'schedule#'
  //     //     },
  //     // }
  //   },
  //   preHandler: async (request, reply) => {},
  //   handler: async (request, reply) => {
  //     const { Schedule, Movie, Cinema, MovieType } = fastify.models;

  //     // const schedules = await (Cinema.findAll({
  //     //     include: [
  //     //         // Movie,
  //     //         Movie
  //     //         // Cinema,
  //     //         // MovieType
  //     //     ],
  //     //     where: {
  //     //         Movies: {
  //     //             Schedule: {
  //     //                 id: 1
  //     //             }
  //     //         }
  //     //     }
  //     // }));

  //     // console.log(schedules);
  //     return await Schedule.findAll({
  //       include: [Movie, Cinema, MovieType],
  //       field: ["date", "time", "id"],
  //     });
  //   },
  // });
  
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

      const movie = await Movie.findByPk(String(request.body.movieId));

      if (!movie) {
        const data = JSON.parse((await apiInstance.movieDetails(String(request.body.movieId))).body);

        await Movie.create({
          id: String(data.id),
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date,
          title: data.title,
          vote: data.vote_average,
        });
      }

      console.log({
        id: data.id,
        overview: data.overview,
        poster_path: data.poster_path,
        release_date: data.release_date,
        title: data.title,
        vote: data.vote_average,
      });


      const cinema = await Cinema.findByPk(request.body.cinemaId);
      const movieType = await MovieType.findByPk(request.body.movieTypeId);

      // console.log(type)

      const schedule = await Schedule.create({
        date: request.body.date,
        time: request.body.time,
      });

      try{

        await schedule.setMovie(movie);
        await schedule.setCinema(cinema);

        await schedule.setMovieType(movieType);
      return schedule;

      } catch(err) {
        await schedule.destroy();
        return {
          error: err.errors.map(({ message, type, path }) => ({  message, type, path })),        // the http error message
          message: err.errors.map(({ message, type, path }) => ({  message, type, path })),      // the user error message
          statusCode: 400   // the http status code
        }
      }
    },
  });
}

module.exports = routes;
