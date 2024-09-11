const jwt = require('jsonwebtoken');
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

    req.session.token = jwt.sign(
        { id: user.id, username: username }, 
        process.env.JWT_KEY, 
        { expiresIn: '3h' }
    );
    
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
