const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const Account = sequelize.define('Account', {
    title: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'accounts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Account;