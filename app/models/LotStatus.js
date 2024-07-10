const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const LotStatus = sequelize.define('LotStatus', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'lot_statuses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = LotStatus;