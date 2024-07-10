const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const Specification = sequelize.define('Specification', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'specifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Specification;