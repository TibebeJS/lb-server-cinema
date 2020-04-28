const { Op } = require("sequelize");
const httpErrors = require("http-errors");
const Tmdb = require("../tmdb-api");
const moment = require("moment");

const API_KEY = process.env.API_KEY;
const apiInstance = new Tmdb({
  apiKey: API_KEY,
});

const distinct = (array) => {
  const result = [];
  const map = new Map();
  for (const item of array) {
    if (item)
      if (!map.has(item.id)) {
        map.set(item.id, true); // set any value to Map
        result.push(item);
      }
  }
  return result;
};

async function routes(fastify, options) {
  // movies now-showing
  fastify.route({
    method: "GET",
    url: "/now-showing",
    schema: {
      querystring: {
        // query: {
        //     type: 'string'
        // }
      },
      response: {
        200: {
            type: 'array',
            items: 'movie#'
        },
      },
    },
    preHandler: async (request, reply) => {},
    handler: async (request, reply) => {
      const { Schedule, Movie } = fastify.models;

      return distinct(
        await Schedule.findAll({
          where: {
            date: {
              [Op.gte]: moment().day(0).toDate(),
              [Op.lte]: moment().day(7).toDate(),
            },
          },
          include: [Movie],
          field: ["Movie"],
        }).map(({ Movie }) => Movie)
      );
    },
  });

  // movies now-showing for admin-panel
  fastify.route({
    method: "GET",
    url: "/now-showing-in-cinemas",
    schema: {
      querystring: {
        // query: {
        //     type: 'string'
        // }
      },
      response: {
        200: {
            type: 'array',
            items: 'movie#'
        },
      },
    },
    preHandler: async (request, reply) => {},
    handler: async (request, reply) => {
      const data = JSON.parse(
        (
          await apiInstance.nowPlayingOnCinema({
            page: 1,
            language: "en-US",
            region: "US",
          })
        ).body
      );

      return data.results
        .filter(({ original_language }) => original_language === "en")
        .sort((x, y) => y.popularity - x.popularity)
        .slice(0, 6);
    },
  });

  // movie types - 2D, 3D ...
  fastify.route({
    method: "GET",
    url: "/types",
    schema: {
      querystring: {
        // query: {
        //     type: 'string'
        // }
      },
      response: {
        200: {
          type: "array",
          items: "movietype#",
        },
      },
    },
    preHandler: async (request, reply) => {},
    handler: async (request, reply) => {
      const MovieTypes = fastify.models.MovieType;
      return await MovieTypes.findAll({});
    },
  });

  // movie suggestions
  fastify.route({
    method: "GET",
    url: "/suggestions",
    schema: {
      querystring: {
        query: {
          type: "string",
        },
      },
      response: {
        200: {
          type: "array",
          items: "movie#",
        },
      },
    },
    preHandler: async (request, reply) => {},
    handler: async (request, reply) => {
      const Movie = fastify.models.Movie;

      const query = request.query;

      if (query.q) {
        const q = query.q;

        if (q.length < 2) {
          return [];
        } else {
          return (
            await apiInstance.searchMovie(q, {
              page: 1,
            })
          ).body.results.slice(0, 3);

          // return await Movie.fconsole.log(indAll({
          //     where: {
          //         title: {
          //             [Op.like]: `%${q}%`
          //         }
          //     }
          // });
        }
      } else {
        return [];
      }
    },
  });

  // UPCOMING MOVIES
  fastify.route({
    method: "GET",
    url: "/up-coming",
    schema: {
      querystring: {
        id: {
          type: "string",
        },
      },
      response: {
        200: {
          type: "array",
          items: "movie#",
        },
      },
    },
    preHandler: async (request, reply) => {},
    handler: async (request, reply) => {
      const UpcomingMovie = fastify.models.UpcomingMovie;
      return await UpcomingMovie.findAll({});
    },
  });

  // MOVIE DETAIL
  fastify.route({
    method: "GET",
    url: "/:movieId/",
    schema: {
      querystring: {
        id: {
          type: "string",
        },
      },
      response: {
        200: {
          type: "array",
          items: "movie#",
        },
      },
    },
    preHandler: async (request, reply) => {},
    handler: async (request, reply) => {
      return [];
    },
  });
}

module.exports = routes;
