const fs = require('fs');
const { Op, Sequelize } = require('sequelize');

const Account = require('../models/Account.js');
const Lot = require('../models/Lot.js');
const LotStatus = require('../models/LotStatus.js');
const Brand = require('../models/Brand.js');
const Model = require('../models/Model.js');
const State = require('../models/State.js');
const Door = require('../models/Door.js');
const Transmission = require('../models/Transmission.js');

const OperationType = require('../models/OperationType.js');
const Operation = require('../models/Operation.js');

const User = require('../models/User.js');
const VehicleStyle = require('../models/VehicleStyle.js');
const Drivetrain = require('../models/Drivetrain.js');
const FuelType = require('../models/FuelType.js');
const Color = require('../models/Color.js');

const access = require('../common/access.js');
const breadcrumb = require('../common/breadcrumb.js');
const scriptPath = require('../common/script-path.js');
const { message, setMessage } = require('../common/message.js');
const utils = require('../common/utils.js');

const offset = 100;

Lot.belongsTo(Account, { foreignKey: 'account_id'});
Lot.belongsTo(LotStatus, { foreignKey: 'lot_status_id'});
Lot.belongsTo(Model, { foreignKey: 'model_id' });
Lot.belongsTo(VehicleStyle, { foreignKey: 'vehicle_style_id'});
Lot.belongsTo(User, { foreignKey: 'user_id'});

Operation.belongsTo(OperationType, { foreignKey: 'operation_type_id' });
Operation.belongsTo(User, { foreignKey: 'user_id' });

const boolValue = (value) => value === 'on' ? true : false;

const all = async (req, res) => {
    const lots = await Lot.findAll({ 
        order: [['activity', 'DESC'], ['created_at', 'DESC']], 
        include: [ Account, LotStatus, Model, User, VehicleStyle ] 
    });
    
    res.render('lots', { 
        title: 'Lots',
        lots,
        access: access.high(req),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/lots', 'Lots')
        ])
     });
}

const create = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/lots');
    }
    
    const accounts = await Account.findAll({ order: [['is_default', 'DESC']], where: { activity: true, user_id: { [Op.is]: null } } });
    const brands = await Brand.findAll({ order: [['title']], where: { activity: true } });
    const lotStatuses = await LotStatus.findAll({ order: [['id', 'DESC']] });
    const models = await Model.findAll({ order: [['title']], where: { activity: true } });
    const vehicleStyles = await VehicleStyle.findAll({ order: [['title']] });
    const drivetrains = await Drivetrain.findAll({ order: [['title']] });
    const fuelTypes = await FuelType.findAll();
    const colors = await Color.findAll({ order: [['title']] });
    const doors = await Door.findAll();
    const states = await State.findAll();
    const transmissions = await Transmission.findAll();
    const maxId = await Lot.max('id');
    const stockId = maxId ? maxId + offset : offset; 
    
    res.render('lots/create', { 
        title: 'Lot creating',
        stockId: stockId,
        accounts,
        brands,
        lotStatuses,
        models,
        vehicleStyles,
        drivetrains,
        fuelTypes,
        colors,
        doors,
        states,
        transmissions,
        script: scriptPath('lots.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/Lots', 'Lots'),
            breadcrumb.make('#', 'Create....'),
        ])
    });
}

const store = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/lots');
    }

    if (!fs.existsSync(`${ process.env.IMAGES_PATH }/stocks/${ req.body.stock_id }`)) {
        fs.mkdir(`${ process.env.IMAGES_PATH }/stocks/${ req.body.stock_id }`, (err) => {
            if (err) {
                setMessage(req, `Lot was not created`, 'danger');
                return res.redirect(`/lots`); 
            } 
        });
    } 
    
    const { stock_id, brand_id, model_id, vehicle_style_id, mileage, mpg_city, mpg_highway, activity,
        abs_brakes, backup_camera, blind_spot_monitoring, curtain_airbags, driver_airbag,
        front_side_airbags, parking_sensors, passenger_airbag, alloy_wheels, bluetooth,
        heated_seats, leather_seats, navigation_system, sunroof_moonroof, technology_package } = req.body;
    const brand = await Brand.findByPk(brand_id);
    const model = await Model.findByPk(model_id);
    const body_style = await VehicleStyle.findByPk(vehicle_style_id);
    let lot = { ...req.body, 
        make: brand.title,
        model: model ? model.title : '',
        body_style: body_style.title,
        mileage: mileage || null,
        mpg_city: mpg_city || null,
        mpg_highway: mpg_highway || null,
        abs_brakes: boolValue(abs_brakes),
        backup_camera: boolValue(backup_camera),
        blind_spot_monitoring: boolValue(blind_spot_monitoring),
        curtain_airbags: boolValue(curtain_airbags),
        driver_airbag: boolValue(driver_airbag),
        front_side_airbags: boolValue(front_side_airbags),
        parking_sensors: boolValue(parking_sensors),
        passenger_airbag: boolValue(passenger_airbag),
        alloy_wheels: boolValue(alloy_wheels),
        bluetooth: boolValue(bluetooth),
        heated_seats: boolValue(heated_seats),
        leather_seats: boolValue(leather_seats),
        navigation_system: boolValue(navigation_system),
        sunroof_moonroof: boolValue(sunroof_moonroof),
        technology_package: boolValue(technology_package),
        activity: boolValue(activity),
        user_id: req.session.user_id
    };

    await Lot.create(lot);
    lot = await Lot.findOne({ where: { stock_id }});   
    
    setMessage(req, `Lot was created`, 'success');
    return res.redirect(`/lots/${ lot.id }/details`); 
}

const edit = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/Lots');
    }
    const { id } = req.params;
    
    const accounts = await Account.findAll({ order: [['is_default', 'DESC']], where: { activity: true, user_id: { [Op.is]: null } } });
    const brands = await Brand.findAll({ order: [['title']], where: { activity: true } });
    const lot = await Lot.findOne({ where: {id}, include: [ Model ]});
    const lotStatuses = await LotStatus.findAll({ order: [['id', 'DESC']] });
    const models = await Model.findAll({ order: [['title']], where: { activity: true } });
    const vehicleStyles = await VehicleStyle.findAll({ order: [['title']] });
    const drivetrains = await Drivetrain.findAll({ order: [['title']] });
    const fuelTypes = await FuelType.findAll();
    const colors = await Color.findAll({ order: [['title']] });
    const doors = await Door.findAll();
    const states = await State.findAll();
    const transmissions = await Transmission.findAll();

    res.render('lots/edit', {
        title: `Lot editing`,
        lot: lot.dataValues,
        accounts,
        brands,
        models,
        vehicleStyles,
        drivetrains,
        fuelTypes,
        colors,
        doors,
        states,
        transmissions,
        lotStatuses,
        script: scriptPath('lots.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/lots', 'Lots'),
            breadcrumb.make(`/lots/${ lot.id}/details`, `Stock No: ${lot.stock_id}`),
            breadcrumb.make('#', 'Edit...'),
        ])
    });
}

const update = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/Lots');
    }
    
    const { id, brand_id, model_id, vehicle_style_id, mileage, mpg_city, mpg_highway, activity,
        abs_brakes, backup_camera, blind_spot_monitoring, curtain_airbags, driver_airbag,
        front_side_airbags, parking_sensors, passenger_airbag, alloy_wheels, bluetooth,
        heated_seats, leather_seats, navigation_system, sunroof_moonroof,
        technology_package } = req.body;
 
    const brand = await Brand.findByPk(brand_id);
    const model = await Model.findByPk(model_id);
    const body_style= await VehicleStyle.findByPk(vehicle_style_id);
    
    const lot = { ...req.body, 
        make: brand.title,
        model: model ? model.title : '',
        body_style: body_style.title, 
        mileage: mileage || null,
        mpg_city: mpg_city || null,
        mpg_highway: mpg_highway || null,
        abs_brakes: boolValue(abs_brakes),
        backup_camera: boolValue(backup_camera),
        blind_spot_monitoring: boolValue(blind_spot_monitoring),
        curtain_airbags: boolValue(curtain_airbags),
        driver_airbag: boolValue(driver_airbag),
        front_side_airbags: boolValue(front_side_airbags),
        parking_sensors: boolValue(parking_sensors),
        passenger_airbag: boolValue(passenger_airbag),
        alloy_wheels: boolValue(alloy_wheels),
        bluetooth: boolValue(bluetooth),
        heated_seats: boolValue(heated_seats),
        leather_seats: boolValue(leather_seats),
        navigation_system: boolValue(navigation_system),
        sunroof_moonroof: boolValue(sunroof_moonroof),
        technology_package: boolValue(technology_package),
        activity: boolValue(activity)
    };
    
    await Lot.update(lot, { where: { id } });
    
    setMessage(req, `Lot was edited`, 'success');
    res.redirect(`/lots/${ id }/details`);
}

const details = async (req, res) => {
    const { id } = req.params;

    const costs = await Operation.findAll({
        attributes: [ 'operation_type_id', [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'] ], 
        group: ['operation_type_id'],
        where: { lot_id: id },
        include: [ OperationType ]    
    });
 
    const costSummary = costs.reduce((acc, el) => {
    const title = (el.dataValues.OperationType.dataValues.title).toLowerCase().replace(' ', '_'); 
    acc[title] = parseInt(el.dataValues.total);
        return acc;
    }, {});
    
    const costTotal = Object.values(costSummary).reduce((acc,el) => acc += el, 0);

    const lot = await Lot.findOne({ where: { id }, include: [ Account, Model, VehicleStyle, LotStatus ]});
    const operations = await Operation.findAll({ where: { lot_id: id }, include: [
        { model: Account, as: 'subAccount'},
        OperationType,
        User
    ] });

    const subAccounts = await Account.findAll({ order: [['title']], where: { activity: true, user_id: { [Op.ne]: null } } } );
    const operationTypes = await OperationType.findAll({ order: [['title']], where: {activity: true, is_car_cost: true}});

    res.render('lots/details', {
        title: `Lot details`,
        lot: lot.dataValues,
        operationTypes,
        operations,
        subAccounts,
        costSummary,
        costTotal,
        script: scriptPath('lot-details.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/lots', 'Lots'),
            breadcrumb.make('#', `Stock No: ${ lot.stock_id }`),
        ])
    });
}

const editDate = async (req, res) => {
    const { id, date_buy, date_ready, date_sale } = req.body;
  
    await Lot.update({ 
        date_buy: date_buy ? date_buy : null, 
        date_ready: date_ready ? date_ready : null, 
        date_sale: date_sale ? date_sale : null 
    }, { where: { id } });
    
    setMessage(req, `Lot was edited`, 'success');
    res.redirect(`/lots/${ id }/details`);

}

const editPrice = async (req, res) => {
    const { id, target_price } = req.body;
  
    await Lot.update({ target_price: target_price ? target_price : null }, { where: { id } });
    
    setMessage(req, `Target price was edited`, 'success');
    res.redirect(`/lots/${ id }/details`);

}

const currentLots = async (req, res) => {
    const rows = await Lot.findAll({ where: { lot_status_id: { [Op.ne]: 2 } }, include: [ Model ] });
    const lots = await Promise.all(rows.map(async (el) => {
        el.dataValues.days_repair = utils.daysDiff(el.date_buy, el.date_ready);
        el.dataValues.days_sale = utils.daysDiff(el.date_ready, utils.currentDate());
        el.dataValues.days_downtime = utils.daysDiff(el.date_buy, utils.currentDate());
        el.dataValues.total_cost = await Operation.sum('amount', { where: { lot_id: el.id } });
        el.dataValues.money_price = utils.moneyPrice(el.dataValues.total_cost, el.dataValues.days_downtime);
        el.dataValues.target_margin = el.dataValues.target_price - el.dataValues.total_cost;
        el.dataValues.marginality = utils.marginality(el.dataValues.target_price, el.dataValues.total_cost);
        return el;
    }));

    res.render('lots/current-lots', {
        title: `Current lots`,
        lots
    });

}

const files = async (req, res) => {
    const lot = await Lot.findOne({ where: { id: req.params.id }, include: [Model] });

    const dir = `${ process.env.IMAGES_PATH }/stocks/${ lot.stock_id }`;
    const files = fs.readdirSync(dir).map(file => file);

    res.render('lots/files', {
        title: 'Files',
        lot: lot.dataValues,
        files,
        imagesURL: `${ process.env.IMAGES_URL }/stocks`,
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/lots', 'Lots'),
            breadcrumb.make(`/lots/${ lot.id }/details`, `Stock No: ${ lot.stock_id }`),
            breadcrumb.make('#', 'Files'),
        ])
    });
}

const upload = async (req, res) => {
    const { id, stock_id } = req.body;
    
    if (!req.files) {
        setMessage(req, `File was not selected`, 'danger');
        return res.redirect(`/lots/${ id }/files`); 
    }
        
    const fileName = `${ stock_id }-${ Date.now() }.${ (req.files.vehicle.name).split('.').splice(-1) }`;
 
    const dir = `${ process.env.IMAGES_PATH }/stocks/${ stock_id }`;
    const files = fs.readdirSync(dir);
    
    if (!files.length) {
        await Lot.update({ image: fileName }, { where: { id } });
    }

    req.files.vehicle.mv(`${ process.env.IMAGES_PATH }/stocks/${ stock_id }/${ fileName }`, (err) => {
        if (err) {
            setMessage(req, `File was not uploaded`, 'danger');
            return res.redirect(`/lots/${ id }/files`); 
        }
    });

    setMessage(req, `File was uploaded`, 'success');
    return res.redirect(`/lots/${ id }/files`);  
}

const setImgDefault = async (req, res) => {
    const { file_name, id } = req.body;
    await Lot.update({ image: file_name }, { where: { id } });
    return res.redirect(`/lots/${ id }/files`);
}    

const removeImg = async (req, res) => {
    const { file_name, id, stock_id } = req.body;
    const filePath = `${ process.env.IMAGES_PATH }/stocks/${ stock_id }/${ file_name }`;

    const fileStat = fs.statSync(filePath);
    if(fileStat.isFile()) {
        fs.unlinkSync(filePath);
    }    

    return res.redirect(`/lots/${ id }/files`);
}    

module.exports = { 
    all, 
    create, 
    store, 
    edit, 
    update, 
    details, 
    editDate, 
    editPrice, 
    currentLots, 
    files, 
    upload,
    setImgDefault,
    removeImg
}