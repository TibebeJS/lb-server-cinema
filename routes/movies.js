const { Op } = require('sequelize');
const httpErrors = require('http-errors');
const Tmdb = require('../tmdb-api');

const API_KEY = process.env.API_KEY
;

const apiInstance = new Tmdb({
    apiKey: API_KEY
});

async function routes (fastify, options) {
    
    // movies now-showing
    fastify.route({
        method: 'GET',
        url: '/now-showing',
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
            }
        },
        beforeHandler: async (request, reply) => {

        },
        handler: async (request, reply) => {
            const Movie = fastify.models.Movie;
            return await Movie.findAll({
            });    
        }
    });

    // movie types - 2D, 3D ...
    fastify.route({
        method: 'GET',
        url: '/types',
        schema: {
            querystring: {
                // query: {
                //     type: 'string'
                // }
            },
            response: {
                200: {
                    type: 'array',
                    items: 'movietype#'
                },
            }
        },
        beforeHandler: async (request, reply) => {

        },
        handler: async (request, reply) => {
            const MovieTypes = fastify.models.MovieType;
            return await MovieTypes.findAll({
            });    
        }
    });
    
    // movie suggestions
    fastify.route({
        method: 'GET',
        url: '/suggestions',
        schema: {
            querystring: {
                query: {
                    type: 'string'
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: 'movie#'
                },
            }
        },
        beforeHandler: async (request, reply) => {

        },
        handler: async (request, reply) => {
            const Movie = fastify.models.Movie;

            const query = request.query;

            if (query.q) {
                const q = query.q;

                if (q.length < 2) {
                    return [];
                } else {
                    return (await apiInstance.searchMovie(q, {
                        page: 1
                    })).body.results.slice(0, 3)

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
    
        }
    });
    
    // UPCOMING MOVIES
    fastify.route({
        method: 'GET',
        url: '/up-coming',
        schema: {
            querystring: {
                id: {
                    type: 'string'
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: 'movie#'
                },
            }
        },
        beforeHandler: async (request, reply) => {

        },
        handler: async (request, reply) => {
            const Movie = fastify.models.Movie;
            return await Movie.findAll({
            });
        }
    });
    
    
    // MOVIE DETAIL
    fastify.route({
        method: 'GET',
        url: '/:movieId/',
        schema: {
            querystring: {
                id: {
                    type: 'string'
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: 'movie#'
                },
            }
        },
        beforeHandler: async (request, reply) => {

        },
        handler: async (request, reply) => {
            return []
        }
    });


}


module.exports = routes;