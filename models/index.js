require("dotenv").config();
const fastifyPlugin = require("fastify-plugin");
const { Sequelize } = require("sequelize");

const sequelizeConfig = {
  instance: "sequelize",
  autoConnect: true,
  dialect: "mariadb",

  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,

  logging: false,
};

const instance = new Sequelize(sequelizeConfig);

exports.bootstrap = async () => {
  const init = async (filePath) => {
    const module = await require(filePath)(instance);
    return module.model;
  };

  const models = {
    Movie: await init("./movie"),
    Cinema: await init("./cinema"),
    SeatType: await init("./seat_type"),
    MovieType: await init("./movie_type"),
    Seat: await init("./seat"),
    Schedule: await init("./schedule"),
    ScheduleMovieType: await init("./schedule_movietype"),
    UpcomingMovie: await init("./upcoming-movie"),
  };

  (async function defineRelations() {
    const {
      Schedule,
      Cinema,
      Seat,
      SeatType,
      Movie,
      MovieType,
      ScheduleMovieType,
    } = models;

    Cinema.belongsToMany(Movie, { through: Schedule });
    Movie.belongsToMany(Cinema, { through: Schedule });

    Cinema.hasMany(Schedule);
    Schedule.belongsTo(Cinema);
    Movie.hasMany(Schedule);
    Schedule.belongsTo(Movie);

    MovieType.belongsToMany(Schedule, { through: ScheduleMovieType });
    Schedule.belongsTo(MovieType);
    // Schedule.hasOne(Movie);
  })();

  await Promise.all(
    Object.values(models).map(async (model) => await model.sync())
  );

  return models;
};

exports.plugin = fastifyPlugin(async function (fastify, options) {
  const models = await exports.bootstrap();
  fastify.decorate("models", models);
});
