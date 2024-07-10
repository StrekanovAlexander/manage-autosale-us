import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Brand = sequelize.define('Brand', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'brands',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Brand;