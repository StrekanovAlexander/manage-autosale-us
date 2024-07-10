const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const User = sequelize.define('User', {
    role_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    root: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;