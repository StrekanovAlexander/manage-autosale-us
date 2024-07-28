const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const FuelType = sequelize.define('FuelType', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'fuel_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = FuelType;