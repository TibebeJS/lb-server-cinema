const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
    const MovieType = sequelize.define('MovieType', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT
        },
        name: {
            type: DataTypes.STRING(15),
            unique: true
        },
        title: {
            type: DataTypes.STRING(35),
            unique: true
        },
    }, { timestamps: false });

    return {
        model: MovieType,
        sync: async () => await MovieType.sync()
    }
}