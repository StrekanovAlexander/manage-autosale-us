const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const Door = sequelize.define('Door', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'doors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Door;