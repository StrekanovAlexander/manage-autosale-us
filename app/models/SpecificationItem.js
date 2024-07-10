import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

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

export default SpecificationItem;