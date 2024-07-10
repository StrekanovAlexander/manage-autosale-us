const currentDate = () => new Date().toISOString().slice(0, 10);
const daysDiff = (date1, date2 = '') => {
    if (!date1) { return null }
    const d1 = new Date(date1);
    const d2 = date2 ? new Date(date2) : currentDate();
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
}

const moneyPrice = (cost, days) => cost * 0.15 / 366 * days;
const marginality = (val1, val2) => val1 / val2 * 100 - 100;

module.exports = {
    currentDate, 
    daysDiff, 
    marginality, 
    moneyPrice
}