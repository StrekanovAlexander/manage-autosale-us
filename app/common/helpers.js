module.exports = {
    date: (date) => date.toISOString().slice(0, 10),
    currentDate: () => new Date().toISOString().slice(0, 10),
    time: (date) => date.toLocaleTimeString('en-US'),

    currency: (val) => !isNaN(val) ? new Intl.NumberFormat().format(val) : '0',
    
    equals: (val1, val2) => val1 === val2,
}