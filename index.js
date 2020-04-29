require("dotenv").config();
const admin = require("./firebase-service");

const fastify = require("fastify")({
  logger: {
    level: 'info',
    file: 'logs.log'
  }
});

const fsequelize = require("fastify-sequelize");

const {
  cinemas,
  movies,
  schedules,
  sendScheduleToTelegram,
} = require("./routes");

fastify.register(require("fastify-cors"), {
  origin: "*",
});

fastify.register(require("./schemas"));

fastify.register(require("./models").plugin).ready();

fastify
  .decorate("verifyAdmin", async function (request, reply, done) {
    const authorizationError = new Error(
      "must be authenticated as an admin to perform this operation"
    );

    if (
      request.headers.authorization &&
      request.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      const userInfo = await admin
        .auth()
        .verifyIdToken(request.headers.authorization.split(" ")[1]);

      try {
        if (userInfo && userInfo.uid) {
          done();
        } else {
          done(authorizationError);
        }
      } catch (error) {
        done(authorizationError);
      }
    } else {
      done(authorizationError);
    }
  })
  .register(require("fastify-auth"))
  .after(async () => {
    fastify.register(
      (fastify, opts, next) => {
        fastify.register(cinemas, {
          prefix: "/cinemas",
        });

        fastify.register(movies, {
          prefix: "/movies",
        });

        fastify.register(schedules, {
          prefix: "/schedules",
        });

        fastify.register(sendScheduleToTelegram, {
          prefix: "/send-schedule-to-telegram",
        });

        next();
      },
      { prefix: process.env.API_BASE }
    );
  });

const start = async () => {
  try {
    await fastify.listen(process.env.PORT, process.env.HOST);
    fastify.log.info(
      `[+] server listening on ${fastify.server.address().port}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
