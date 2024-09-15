const bcrypt = require('bcrypt');
const helpers = require('../common/helpers.js');
const breadcrumb = require('../common/breadcrumb.js');

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

    req.session.token = bcrypt.hashSync(Math.random().toString(36), bcrypt.genSaltSync());
    res.cookie('session_token', req.session.token, { maxAge: 60000 * 60 * 24 });

    req.session.user_id = user.id;
    req.session.grade = user.Role.grade;
    helpers.user = () => user.username;
    
    return res.redirect('/');
};

const logout = (req, res) => {
    delete req.session.token;
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
