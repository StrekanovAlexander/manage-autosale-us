exports.message = (req) => {
    let msg = null;
    // if (req.session.msg) {
    //     msg = req.session.msg;
    //     req.session.msg = null;
    // }
    // return msg;
    return { title: '', type: '' };
}

exports.setMessage = (req, title, type) => {
    // req.session.msg = { title, type };
    return { title, type };
}