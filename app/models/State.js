const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const State = sequelize.define('State', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'states',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = State;