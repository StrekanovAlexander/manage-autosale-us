import fs from 'fs';
import { Op, Sequelize } from 'sequelize';

import Account from '../models/Account.js';
import Lot from '../models/Lot.js';
import LotStatus from '../models/LotStatus.js';
import Brand from '../models/Brand.js';
import Model from '../models/Model.js';

import Specification from '../models/Specification.js';
import SpecificationItem from '../models/SpecificationItem.js';
import OperationType from '../models/OperationType.js';
import Operation from '../models/Operation.js';

import User from '../models/User.js';
import VehicleStyle from '../models/VehicleStyle.js';

import access from '../common/access.js';
import breadcrumb from '../common/breadcrumb.js';
import scriptPath from '../common/script-path.js';
import { message, setMessage } from '../common/message.js';
import utils from '../common/utils.js';

const offset = 100;

Lot.belongsTo(Account, { foreignKey: 'account_id'});
Lot.belongsTo(LotStatus, { foreignKey: 'lot_status_id'});
Lot.belongsTo(Model, { foreignKey: 'model_id' });
Lot.belongsTo(VehicleStyle, { foreignKey: 'vehicle_style_id'});
Lot.belongsTo(User, { foreignKey: 'user_id'});

Operation.belongsTo(OperationType, { foreignKey: 'operation_type_id' });
Operation.belongsTo(User, { foreignKey: 'user_id' });

const all = async (req, res) => {
    const lots = await Lot.findAll({ 
        order: [['id', 'DESC']], 
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

    const specificationList = await Specification.findAll({ order: [['title']], where: { activity: true } });
    const specificationItemLists = await SpecificationItem.findAll({ order: [['title']], where: { activity: true } });
    const specifications = specificationList.reduce((acc, el) => {
        const items = specificationItemLists.filter(item => item.specification_id === el.id);
        if (items.length) {
            const specification = { id: el.id, title: el.title, items};  
            acc.push(specification);  
        }
        return acc;
    }, []); 
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
        specifications,
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

    if (!fs.existsSync(`public/images/vehicles/${ req.body.stock_id }`)) {
        fs.mkdir(`public/images/vehicles/${ req.body.stock_id }`, (err) => {
            if (err) {
                setMessage(req, `Lot was not created`, 'danger');
                return res.redirect(`/lots`); 
            } 
        });
    } 

    const entries = Object.entries(req.body);
    const _specifications = entries
        .filter(el => el[0].includes('specification_') && el[1].length > 0)
        .reduce((acc, el) => {
            const specification_id = el[0].split('_')[1];
            const specification_item_id = el[1];
            acc.push({ specification_id, specification_item_id });
            return acc;
        }, []);
    const specifications = JSON.stringify(_specifications);

    const { stock_id, number_id, account_id, vehicle_style_id, model_id, lot_status_id, vin, year, description } = req.body;
    await Lot.create({ stock_id, number_id, account_id, vehicle_style_id, model_id, lot_status_id, 
        vin, year, description, specifications, user_id: req.session.user_id });

    const lot = await Lot.findOne({ where: { stock_id }});   
    
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
    const specificationList = await Specification.findAll({ order: [['title']], where: { activity: true } });
    const specificationItemLists = await SpecificationItem.findAll({ order: [['title']], where: { activity: true } });
    const _specifications = JSON.parse(lot.specifications);

    const specifications = specificationList.reduce((acc, el) => {
        const items = specificationItemLists.filter(item => item.specification_id === el.id);
        if (items.length) {
            const _selected = _specifications.filter(s => Number(s.specification_id) === el.id);
            const selected = _selected.length ? Number(_selected[0].specification_item_id) : false; 
            const specification = { id: el.id, title: el.title, items, selected };  
            acc.push(specification);  
        }
        return acc;
    }, []); 

    res.render('lots/edit', {
        title: `Lot editing`,
        lot: lot.dataValues,
        accounts,
        brands,
        models,
        vehicleStyles,
        lotStatuses,
        specifications,
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
    
    const entries = Object.entries(req.body);
    const _specifications = entries
        .filter(el => el[0].includes('specification_') && el[1].length > 0)
        .reduce((acc, el) => {
            const specification_id = el[0].split('_')[1];
            const specification_item_id = el[1];
            acc.push({ specification_id, specification_item_id });
            return acc;
        }, []);
    const specifications = JSON.stringify(_specifications);

    const { id, account_id, vehicle_style_id, model_id, lot_status_id, vin, year, description } = req.body;
    const lot = { account_id, vehicle_style_id, model_id, lot_status_id, vin, year, 
        description, specifications, user_id: req.session.user_id };
    
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

    const specifications = lot.specifications ? await buildSpecifications(lot.specifications) : [];
    const operationTypes = await OperationType.findAll({ order: [['title']], where: {activity: true, is_car_cost: true}});

    res.render('lots/details', {
        title: `Lot details`,
        lot: lot.dataValues,
        specifications,
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

const buildSpecifications = async (specifications) => {
    const data = JSON.parse(specifications);
    const specificationList = await Specification.findAll({ order: [['title']], where: { activity: true } });
    const specificationItemLists = await SpecificationItem.findAll({ order: [['title']], where: { activity: true } });

    return specificationList.reduce((acc, el) => {
        const items = specificationItemLists.filter(item => item.specification_id === el.id);
        if (items.length) {
            const _selected = data.filter(s => Number(s.specification_id) === el.id);
            const selected = _selected.length ? Number(_selected[0].specification_item_id) : false; 
            if (selected) {
                const item = items.filter(item => item.id === selected)[0];
                const specification = { title: el.title, itemTitle: item.title };  
                acc.push(specification);  
            }
        }
        return acc;
    }, []);
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

    const dir = `public/images/vehicles/${ lot.stock_id }`;
    const files = fs.readdirSync(dir).map(file => file);

    res.render('lots/files', {
        title: 'Files',
        lot: lot.dataValues,
        files,
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/lots', 'Lots'),
            breadcrumb.make(`/lots/${ lot.id }/details`, `Stock No: ${ lot.stock_id }`),
            breadcrumb.make('#', 'Files'),
        ])
    });
}

const upload = (req, res) => {
    const { id, stock_id } = req.body;
    
    if (!req.files) {
        setMessage(req, `File was not selected`, 'danger');
        return res.redirect(`/lots/${ id }/files`); 
    }
        
    const fileName = `${ stock_id }-${ Date.now() }.${ (req.files.vehicle.name).split('.').splice(-1) }`;
 
    req.files.vehicle.mv(`public/images/vehicles/${ stock_id }/${ fileName }`, (err) => {
        if (err) {
            setMessage(req, `File was not uploaded`, 'danger');
            return res.redirect(`/lots/${ id }/files`); 
        }
    });

    setMessage(req, `File was uploaded`, 'success');
    return res.redirect(`/lots/${ id }/files`);  
}

export default { all, create, store, edit, update, details, editDate, editPrice, currentLots, files, upload };