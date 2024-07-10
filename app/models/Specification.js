import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

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

export default Specification;