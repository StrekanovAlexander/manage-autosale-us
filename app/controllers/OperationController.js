import { Op } from 'sequelize';
import paginate from 'express-paginate';
import Account from '../models/Account.js';
import Lot from '../models/Lot.js';
import Operation from '../models/Operation.js';
import OperationType from '../models/OperationType.js';
import User from '../models/User.js';

import access from '../common/access.js';
import breadcrumb from '../common/breadcrumb.js';
import scriptPath from '../common/script-path.js';
import { message, setMessage } from '../common/message.js';

Operation.belongsTo(Account, { as: 'account', foreignKey: 'account_id' });
Operation.belongsTo(Account, { as: 'subAccount', foreignKey: 'sub_account_id' });
Operation.belongsTo(Lot, { foreignKey: 'lot_id' });
Operation.belongsTo(OperationType, { foreignKey: 'operation_type_id' });
Operation.belongsTo(User, { foreignKey: 'user_id' });


const all = async (req, res) => {
    
    const results = await Operation.findAndCountAll({
        where: { lot_id: { [Op.is]: null } },
        order: [['date_reg', 'DESC'], ['created_at', 'DESC']],
        limit: req.query.limit, 
        offset: req.skip,
        include: [ Lot, OperationType, User, { model: Account, as: 'account' }, { model: Account, as: 'subAccount'} ]
    });

    const pageCount = Math.ceil(results.count / req.query.limit);
    const pages = paginate.getArrayPages(req)(req.query.limit, pageCount, req.query.page);

    const accounts = await Account.findAll({ order: [['is_default', 'DESC']], where: { activity: true, user_id: { [Op.is]: null } }});
    const subAccounts = await Account.findAll({ order: [['title']], where: { activity: true, is_default: false } } );
    const operationTypes = await OperationType.findAll({ order: [['title']], where: {activity: true, is_car_cost: false}});
     
    res.render('operations', { 
        title: 'Operations',
        accounts,
        subAccounts,
        operationTypes,
        script: scriptPath('operations.js'),
        operations: results.rows,
        pages,
        hasPrevPage: req.query.page > 1,
        hasNextPage: req.query.page < pageCount,
        prevPage: paginate.href(req)(true),
        nextPage: paginate.href(req)(),
        access: access.high(req),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/operations', 'Operations')
        ])
    });
}

const store = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/operations');
    }
   
    const { date_reg, account_id, sub_account_id, operation_type_id, amount, description } = req.body;
    const operationType = await OperationType.findByPk(operation_type_id);
    const direction = operationType.direction;
    const user_id = req.session.user_id;
    const operation = { date_reg, account_id, sub_account_id, operation_type_id, amount, description, direction, user_id };
     
    await Operation.create(operation);
    setMessage(req, `Operation was created`, 'success');
    res.redirect('/');
}

const update = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/operations');
    }

    const { id, operation_type_id } = req.body;
    
    const operationType = await OperationType.findByPk(operation_type_id);
    const direction = operationType.direction;
    const user_id = req.session.user_id;
    const operation = await Operation.findByPk(id);
    
    await Operation.update({ ...req.body, direction, user_id }, { where: { id } });
    
    if (operation.lot_id) {
        setMessage(req, `Cost was edited`, 'success');
        res.redirect(`/lots/${ operation.lot_id }/details`);    
    } else {
        setMessage(req, `Operation was edited`, 'success');
        res.redirect('/');
    }    
}

const storeLot = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/operations');
    }
    const { operation_type_id, lot_id } = req.body;
    const operationType = await OperationType.findByPk(operation_type_id);
    const direction = operationType.direction;
    const user_id = req.session.user_id;
    const operation = { ...req.body, direction, user_id, lot_id };
     
    await Operation.create(operation);
    setMessage(req, `Cost for lot was created`, 'success');
    res.redirect(`/lots/${lot_id}/details`);
}

const remove = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/operations');
    }

    const { id } = req.body;
    await Operation.destroy({ where: { id } });
    setMessage(req, `Operation was deleted`, 'success');
    res.redirect('/operations');
    
}

export default { all, store, update, storeLot, remove };