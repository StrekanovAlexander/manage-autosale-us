/*
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import helpers from '../common/helpers.js';
import breadcrumb from '../common/breadcrumb.js';

import Role from '../models/Role.js';
import User from '../models/User.js';

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
        { expiresIn: 3600 }
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
*/

const home = (req, res) => {
    res.render('home', { 
        title: 'Home', 
    //    breadcrumb: breadcrumb.build() 
    });
};

module.exports = {
    home
}

// export default { login, logout, home };