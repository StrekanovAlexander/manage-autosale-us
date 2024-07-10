const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const SpecificationItem = sequelize.define('SpecificationItem', {
    specification_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'specification_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SpecificationItem;