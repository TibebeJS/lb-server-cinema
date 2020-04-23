const movie = require('./movie');
const schedule = require('./schedule');
const movietype = require('./movietype');

const fastifyPlugin = require('fastify-plugin');

module.exports = fastifyPlugin(
    async function (fastify, options) {
        fastify.addSchema(movie);
        fastify.addSchema(schedule);
        fastify.addSchema(movietype);
    }
)