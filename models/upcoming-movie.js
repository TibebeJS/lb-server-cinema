const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
  const Movie = sequelize.define(
    "UpcomingMovie",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      overview: DataTypes.TEXT,
      poster_path: DataTypes.STRING,
      release_date: DataTypes.DATE,
      title: DataTypes.STRING(35),
      vote: DataTypes.DOUBLE,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["title", "release_date"],
        },
      ],
      timestamps: false,
    }
  );

  return {
    model: Movie,
    sync: async () => await Movie.sync(),
  };
};
