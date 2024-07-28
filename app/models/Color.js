const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const Color = sequelize.define('Color', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'colors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Color;