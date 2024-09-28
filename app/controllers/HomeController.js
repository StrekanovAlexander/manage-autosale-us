const bcrypt = require('bcrypt');
const helpers = require('../common/helpers');
const breadcrumb = require('../common/breadcrumb');

const Role = require('../models/Role.js');
const User = require('../models/User.js');

const login = async (req, res) => {
    const { username, password } = req.body;
    User.belongsTo(Role, { foreignKey: 'role_id' });
    const user = await User.findOne({ 
        include: Role, 
        where: { username: username, activity: true }
    });

    if (!user) {
        return res.redirect('/login');
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        return res.redirect('/login');
    }

    // req.session.token = bcrypt.hashSync(process.env.SESS_UUID, bcrypt.genSaltSync());
    // req.session.user_id = user.id;
    // req.session.grade = user.Role.grade;

    const token = bcrypt.hashSync(process.env.SESS_UUID, bcrypt.genSaltSync());
    const maxAge = 24 * 60 * 60 * 1000;

    res.cookie('session_token', token, { maxAge });
    res.cookie('uid', user.id, { maxAge }) 
    helpers.user = () => user.username;
    
    return res.redirect('/');
};

const logout = (req, res) => {
    // delete req.session.token;
    res.clearCookie('session_token');
    res.clearCookie('uid');
	return res.redirect('/');
};

const home = (req, res) => {
    res.render('home', { 
        title: 'Home', 
        breadcrumb: breadcrumb.build() 
    });
};

module.exports = {
    home,
    login,
    logout
}
