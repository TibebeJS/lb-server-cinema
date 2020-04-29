const { DataTypes } = require("sequelize");
const { importModel } = require("./utils");

module.exports = async (sequelize) => {
  const Schedule = sequelize.define(
    "Schedule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        required: true,
      },
      time: {
        type: DataTypes.TIME,
        required: true,
      },
    },
    {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["date", "time", "CinemaId"],
        },
      ],
    }
  );

  return {
    model: Schedule,
    sync: async () => await Schedule.sync(),
  };
};
