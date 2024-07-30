const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const Transmission = sequelize.define('Transmission', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'transmissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Transmission;