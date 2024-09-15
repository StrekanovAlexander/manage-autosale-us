module.exports = (req, res, next) => {

    if (!req.cookies) {
        return res.redirect('/login');
    }

    if (!req.session.token) {
        return res.redirect('/login');
    }

    if (!req.cookies['session_token']) {
        return res.redirect('/login');
    }

    if (req.session.token !== req.cookies['session_token']) {
        return res.redirect('/login');
    }

    next();
}