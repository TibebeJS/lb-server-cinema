const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
  const Cinema = sequelize.define(
    "Cinema",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      name: {
        type: DataTypes.STRING(35),
        unique: true,
      },
      rows: {
        type: DataTypes.INTEGER,
      },
      columns: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false }
  );

  return {
    model: Cinema,
    sync: async () => await Cinema.sync(),
  };
};
