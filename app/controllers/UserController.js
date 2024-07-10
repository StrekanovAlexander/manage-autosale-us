import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import Role from '../models/Role.js';
import User from '../models/User.js';
import access from '../common/access.js';
import breadcrumb from '../common/breadcrumb.js';
import scriptPath from '../common/script-path.js';
import { message, setMessage } from '../common/message.js';

const all = async (req, res) => {
    User.belongsTo(Role, { foreignKey: 'role_id' });
    const users = await User.findAll({ order: [['username']], include: Role });
    res.render('users', { 
        title: 'Users',
        users: users,
        access: access.high(req),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/users', 'Users'),
        ])
     });
}

const create = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/users');
    }

    const roles = await Role.findAll({ order: [['id', 'DESC']] });
    res.render('users/create', { 
        title: 'User creating',
        roles: roles,
        validator: scriptPath('validators/user/user-create.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/users', 'Users'),
            breadcrumb.make('#', 'Create...'),
        ])
    });
}

const store = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/users');
    }
    const { username, password, role_id } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user) {
        setMessage(req, `User "${username}" already exists`, 'danger');
        return res.redirect('/users/create');
    }
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync());
    await User.create({ role_id, username, password: hash });
    setMessage(req, `User "${username}" was created`, 'success');
    res.redirect('/users');
}

const edit = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/users');
    }
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });

    const roles = await Role.findAll({ order: [['id', 'DESC']] });
    res.render('users/edit', {
        title: 'User editing',
        user: user.dataValues,
        validator: scriptPath('validators/user/user-edit.js'),
        roles: roles,
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/users', 'Users'),
            breadcrumb.make('#', 'Edit...'),
        ])
    });
}

const update = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/users');
    }
    const { id, role_id, username, activity } = req.body;
    let user = await User.findOne({ attributes: ['id', 'username'], 
        where: { id: { [Op.ne]: id }, username: username }
    });
    if (user) {
        setMessage(req, `Such login "${username}" already using`, 'danger');
        return res.redirect(`/users/${id}/edit`);    
    }
    user = await User.findOne({ where: { id } });
    if (user.root) {
        await User.update({ role_id, username }, { where: { id } });
    } else {
        await User.update({ role_id, username, activity: activity === 'on' ? true : false }, 
            { where: { id } }
        );
    }
    
    setMessage(req, `User "${ username }" was edited`, 'success');
    res.redirect('/users');
}

const pwd = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/users');
    }
    const { id } = req.params;
    const user = await User.findOne({ attributes: ['id', 'username'], where: { id } });
    res.render('users/pwd', {
        title: 'Password changing',
        user: user.dataValues,
        validator: scriptPath('validators/user/user-pwd.js'),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/users', 'Users'),
            breadcrumb.make('#', 'Password change...'),
        ])
    });
}

const savePwd = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/users');
    }
    const { id, password } = req.body;
    const user = await User.findOne({ attributes: ['username'], where: { id } });
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync());
    await User.update({ password: hash }, { where: { id } });
    setMessage(req, `Password of  "${ user.username }" was changed`, 'success');
    res.redirect('/users');
}

export default { all, create, store, edit, update, pwd, savePwd };