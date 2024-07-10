import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Operation = sequelize.define('Operation', {
    account_id: DataTypes.INTEGER,
    sub_account_id: DataTypes.INTEGER,
    operation_type_id: DataTypes.INTEGER,
    lot_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    date_reg: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    amount: DataTypes.DECIMAL(10, 2), 
    description: DataTypes.STRING,
    direction: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['in', 'out']],
        },
    },
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'operations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Operation;
