const Brand = require('../models/Brand.js');
const Lot = require('../models/Lot.js');
const Model = require('../models/Model.js');
const VehicleStyle = require('../models/VehicleStyle.js');

Lot.belongsTo(Model, { foreignKey: 'model_id' });
Lot.belongsTo(VehicleStyle, { foreignKey: 'vehicle_style_id'});

const brands = async (req, res) => {
    const rows = await Brand.findAll({ where: { activity: true }});
    const brands = rows.map(el => ({ id: el.id, title: el.title }));
    res.json(brands);
}

const lots = async (req, res) => {
    const rows = await Lot.findAll({ 
        where: { activity: true, lot_status_id: 1 },
        include: [ Model, VehicleStyle]
    });
    const lots = rows.map(el => { 

        // const lots = await Promise.all(rows.map(async (el) => {
        //     el.dataValues.days_repair = utils.daysDiff(el.date_buy, el.date_ready);
        //     el.dataValues.days_sale = utils.daysDiff(el.date_ready, utils.currentDate());
        //     el.dataValues.days_downtime = utils.daysDiff(el.date_buy, utils.currentDate());
        //     el.dataValues.total_cost = await Operation.sum('amount', { where: { lot_id: el.id } });
        //     el.dataValues.money_price = utils.moneyPrice(el.dataValues.total_cost, el.dataValues.days_downtime);
        //     el.dataValues.target_margin = el.dataValues.target_price - el.dataValues.total_cost;
        //     el.dataValues.marginality = utils.marginality(el.dataValues.target_price, el.dataValues.total_cost);
        //     return el;
        // }));
        return { 
            id: el.id,
            stock_id: el.stock_id, 
            title: el.title,
            brand_id: el.Model.brand_id,
            model: el.Model.title,
            vehicle_style_id: el.vehicle_style_id,
            vehicle_style: el.VehicleStyle.title,
            vin: el.vin,
            year: el.year,
            target_price: el.target_price,
            description: el.description
        }
    });
    res.json(lots);
}

module.exports = {
    brands, 
    lots
}