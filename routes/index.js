const cinemas = require("./cinemas");
const movies = require("./movies");
const schedules = require("./schedule");
const logs = require("./logs");
const users = require("./users");
const sendScheduleToTelegram = require("./sendScheduleToTelegram");

module.exports = {
  cinemas,
  movies,
  schedules,
  sendScheduleToTelegram,
  logs,
  users,
};
