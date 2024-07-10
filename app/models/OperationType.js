import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const OperationType = sequelize.define('OperationType', {
    title: DataTypes.STRING,
    direction: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['in', 'out']],
        },
    },
    is_car_cost: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,    
    },
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'operation_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default OperationType;