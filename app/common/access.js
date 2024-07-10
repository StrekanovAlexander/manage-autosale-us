const { setMessage } = require('./message.js');

const high = (req) => req.session.grade === 'xx';
const middle = (req) => req.session.grade === 'x-';
const low = (req) => req.session.grade === '--';

const isAllow = (req, fn) => {
    if (!fn(req)) {
        setMessage(req, `Not enough permissions`, 'danger');
        return false;
    }
    return true;
};

module.exports = { 
    high,
    isAllow, 
    low,
    middle 
}