const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
    const SeatType = sequelize.define('SeatType', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT
        },
        name: {
            type: DataTypes.STRING(35),
            unique: true
        },
    }, { timestamps: false });

    return {
        model: SeatType,
        sync: async () => await SeatType.sync()
    }
}