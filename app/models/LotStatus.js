import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const LotStatus = sequelize.define('LotStatus', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'lot_statuses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default LotStatus;