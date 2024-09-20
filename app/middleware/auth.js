const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {

    if (!req.session.token) {
        return res.redirect('/login');
    }

    const match = bcrypt.compareSync(process.env.SESS_UUID, req.session.token);

    if (!match) {
        return res.redirect('/login');
    }

    next();
}