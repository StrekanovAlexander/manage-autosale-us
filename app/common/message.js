export const message = (req) => {
    let msg = null;
    if (req.session.msg) {
        msg = req.session.msg;
        req.session.msg = null;
    }
    return msg;
}

export const setMessage = (req, title, type) => {
    req.session.msg = { title, type };
}