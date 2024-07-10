import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const VehicleStyle = sequelize.define('VehicleStyle', {
    title: DataTypes.STRING,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'vehicle_styles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default VehicleStyle;