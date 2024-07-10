import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Lot = sequelize.define('Lot', {
    account_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER,
    number_id: DataTypes.STRING,
    lot_status_id: DataTypes.INTEGER,
    model_id: DataTypes.INTEGER,
    vehicle_style_id: DataTypes.INTEGER,
    date_buy: DataTypes.DATEONLY,
    date_ready: DataTypes.DATEONLY,
    date_sale: DataTypes.DATEONLY,
    vin: DataTypes.STRING,
    year: DataTypes.STRING,
    target_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    specifications: DataTypes.TEXT,
    description: DataTypes.TEXT,
    activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'lots',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Lot;