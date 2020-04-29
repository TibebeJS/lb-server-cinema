const cinemas = require("./cinemas");
const movies = require("./movies");
const schedules = require("./schedule");
const sendScheduleToTelegram = require("./sendScheduleToTelegram");

module.exports = {
  cinemas,
  movies,
  schedules,
  sendScheduleToTelegram,
};
