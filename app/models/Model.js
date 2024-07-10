import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Model = sequelize.define('Model', {
    brand_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'models',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Model;