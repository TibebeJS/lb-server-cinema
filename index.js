require('dotenv').config()

const fastify = require('fastify')({
    logger: true
});

const fsequelize = require('fastify-sequelize')

const { cinemas, movies, schedules, sendScheduleToTelegram } = require('./routes')

const API_BASE = 'api/';

fastify.register(require('fastify-cors'), {
    // put your options here
    origin: '*'
})

fastify.register(require('./schemas'));

fastify.register(require('./models').plugin).ready();

fastify.register((fastify, opts, next) => {

    fastify.register(cinemas, {
        prefix: '/cinemas'
    })

    fastify.register(movies, {
        prefix: '/movies'
    })

    fastify.register(schedules, {
        prefix: '/schedules'
    })
    
    fastify.register(sendScheduleToTelegram, {
        prefix: '/send-schedule-to-telegram'
    })

    next();

}, { prefix: API_BASE });


const start = async () => {
    try {
        await fastify.listen(process.env.PORT, process.env.HOST);
        fastify.log.info(`[+] server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();