import { setMessage } from './message.js';

const high = (req) => req.session.grade === 'xx';
const middle = (req) => req.session.grade === 'x-';
const low = (req) => req.session.grade === '--';

const isAllow = (req, fn) => {
    if (!fn(req)) {
        setMessage(req, `Недостаточно прав`, 'danger');
        return false;
    }
    return true;
};

export default { high, middle, low, isAllow };