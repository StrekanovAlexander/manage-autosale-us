const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');

const Lot = sequelize.define('Lot', {
    account_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER,
    number_id: DataTypes.STRING,
    lot_status_id: DataTypes.INTEGER,
    model_id: DataTypes.INTEGER,
    vehicle_style_id: DataTypes.INTEGER,
    body_style: DataTypes.STRING,
    make: DataTypes.STRING,
    model: DataTypes.STRING,
    drivetrain: DataTypes.STRING,
    engine: DataTypes.STRING,
    horsepower: DataTypes.STRING,
    abs_brakes: DataTypes.BOOLEAN,
    backup_camera: DataTypes.BOOLEAN,
    blind_spot_monitoring: DataTypes.BOOLEAN,
    curtain_airbags: DataTypes.BOOLEAN,
    driver_airbag: DataTypes.BOOLEAN,
    front_side_airbags: DataTypes.BOOLEAN,
    parking_sensors: DataTypes.BOOLEAN,
    passenger_airbag: DataTypes.BOOLEAN,
    alloy_wheels: DataTypes.BOOLEAN,
    bluetooth: DataTypes.BOOLEAN,
    heated_seats: DataTypes.BOOLEAN,
    leather_seats: DataTypes.BOOLEAN,
    navigation_system: DataTypes.BOOLEAN,
    sunroof_moonroof: DataTypes.BOOLEAN,
    technology_package: DataTypes.BOOLEAN,
    fuel_type: DataTypes.STRING, 
    exterior_color: DataTypes.STRING, 
    interior_color: DataTypes.STRING, 
    doors: DataTypes.STRING,
    mpg_city: {
        type: DataTypes.INTEGER,
        allowNull: null,
    },    
    mpg_highway: {
        type: DataTypes.INTEGER,
        allowNull: null
    },
    transmission: DataTypes.STRING,
    date_buy: DataTypes.DATEONLY,
    date_ready: DataTypes.DATEONLY,
    date_sale: DataTypes.DATEONLY,
    vin: DataTypes.STRING,
    year: DataTypes.STRING,
    state: DataTypes.STRING,
    mileage: {
        type: DataTypes.INTEGER,
        allowNull: null,
    }, 
    target_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
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

module.exports = Lot;