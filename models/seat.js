const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
  const Seat = sequelize.define(
    "Seat",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      row: {
        type: DataTypes.INTEGER,
      },
      column: {
        type: DataTypes.INTEGER,
      },
      note: {
        type: DataTypes.TEXT,
      },
    },
    { timestamps: false }
  );

  return {
    model: Seat,
    sync: async () => await Seat.sync(),
  };
};
