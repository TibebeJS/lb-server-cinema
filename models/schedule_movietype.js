const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
    const ScheduleMovieType = sequelize.define('ScheduleMovieType', {
    }, { timestamps: false });

    return {
        model: ScheduleMovieType,
        sync: async () => await ScheduleMovieType.sync()
    }
}