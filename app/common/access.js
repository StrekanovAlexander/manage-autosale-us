const { setMessage } = require('./message.js');

const high = (req) => true; // req.session.grade === 'xx';
const middle = (req) => true; // req.session.grade === 'x-';
const low = (req) => true; //req.session.grade === '--';

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