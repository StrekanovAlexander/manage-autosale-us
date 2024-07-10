const { Sequelize } = require('sequelize');
const breadcrumb = require('../common/breadcrumb');
const Account = require('../models/Account');
const Operation = require('../models/Operation');
const OperationType = require('../models/OperationType');

Operation.belongsTo(Account, { as: 'SubAccount', foreignKey: 'sub_account_id' });
Operation.belongsTo(OperationType, { foreignKey: 'operation_type_id' });

// Accounts
const totalSubAccounts = async (account_id, operation_type_id) => {
    const subAccounts = await Operation.findAll({ 
        attributes: [ 'sub_account_id', [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'] ], 
        group: ['sub_account_id'], 
        where: { account_id, operation_type_id },
        include: [ { model: Account, as: 'SubAccount'} ]
    });
     
    return subAccounts
        .sort((a, b) => a.SubAccount.title > b.SubAccount.title ? 1 : -1)
        .reduce((acc, el) => {
            acc.push({ id: el.sub_account_id,  title: el.SubAccount.title, amount: el.dataValues.amount});
            return acc;
        }, []);
}

const operationsDetails = async (account_id, operation_type_id, subAccounts) => {
    const operations = await Operation.findAll({ order: [['date_reg', 'DESC'], ['created_at', 'DESC']], 
        where: { account_id, operation_type_id }, include: [ OperationType ] });

    return operations.reduce((acc, el) => {
        const { id, sub_account_id, date_reg, amount, description} = el.dataValues;
        
        const row = { 
            id, date_reg, 
            operationType: el.dataValues.OperationType.dataValues.title, 
            description, 
            subAccounts: []
        };

        subAccounts.forEach(el => {
            row.subAccounts.push({ title: el.title, amount: sub_account_id === el.id ? amount : 0 })
        });

        acc.push(row);
        return acc;

    }, []);
}

const accounts = async (req, res) => {
    const accounts = await Account.findAll({order: [['is_default', 'DESC'], ['title']], where: {activity: true} });
    res.render('reports/accounts', { 
        title: 'Accounts',
        accounts,
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/reports', 'Reports'),
            breadcrumb.make('#', 'Accounts')
        ])
    });
}

const account = async (req, res) => {
    const account = await Account.findByPk(req.params.id);
    const subAccounts = await totalSubAccounts(req.params.id, 1);
    const operations = await operationsDetails(req.params.id, 1, subAccounts);

    res.render('reports/account', { 
        title: 'Account: ' + account.title,
        subAccounts,
        operations,
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/reports', 'Reports'),
            breadcrumb.make('/reports/accounts', 'Accounts'),
            breadcrumb.make('#', account.title)
        ])
    });
}

module.exports = { 
    accounts, 
    account
}