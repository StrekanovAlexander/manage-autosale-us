import Account from '../models/Account.js';
import User from '../models/User.js';
import access from '../common/access.js';
import breadcrumb from '../common/breadcrumb.js';
import scriptPath from '../common/script-path.js';
import { message, setMessage } from '../common/message.js';

Account.belongsTo(User, { foreignKey: 'user_id' });

const all = async (req, res) => {
    const accounts = await Account.findAll({ order: [['title']], include: [ User ] });
    const users = await User.findAll({ order: [[ 'username' ]]});
    res.render('accounts', { 
        title: 'Accounts',
        accounts,
        users,
        access: access.high(req),
        msg: message(req),
        script: scriptPath('accounts.js'),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/accounts', 'Accounts')
        ])
     });
}

const store = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/accounts');
    }
    
    const { title, user_id, activity } = req.body;
    await Account.create({ title, user_id: user_id || null, activity: activity === 'on' });
    setMessage(req, 'Account was created', 'success');
    
    res.redirect('/accounts');
}

const update = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/accounts');
    }
    const { id, title, user_id, activity } = req.body;
    await Account.update({ title, user_id: user_id || null, activity: activity === 'on' }, { where: { id } });
    setMessage(req, `Account was edite`, 'success');
    
    res.redirect('/accounts');
}

export default { all, store, update };