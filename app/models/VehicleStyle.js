const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const VehicleStyle = sequelize.define('VehicleStyle', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'vehicle_styles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = VehicleStyle;