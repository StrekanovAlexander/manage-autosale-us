import OperationType from '../models/OperationType.js';
import access from '../common/access.js';
import breadcrumb from '../common/breadcrumb.js';
import scriptPath from '../common/script-path.js';
import { message, setMessage } from '../common/message.js';

const all = async (req, res) => {
    const operationTypes = await OperationType.findAll({ order: [['title']] });
    res.render('operation-types', { 
        title: 'Operation types',
        operationTypes,
        access: access.high(req),
        msg: message(req),
        script: scriptPath('operation-types.js'),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/operation-types', 'Operation types')
        ])
    });
}

const store = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/operation-types');
    }

    const { title, direction, is_car_cost, activity } = req.body;

    await OperationType.create({ 
        title, 
        direction, 
        is_car_cost: is_car_cost === 'on',
        activity: activity === 'on' 
    });
    
    setMessage(req, `Operation type was created`, 'success');
    res.redirect('/operation-types');
}

const update = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/operation-types');
    }
    const { id, title, direction, is_car_cost, activity } = req.body;

    await OperationType.update({ title, direction, 
        is_car_cost: is_car_cost === 'on',  
        activity: activity === 'on' }, 
        { where: { id } }
    );
    setMessage(req, `Operation type was edited`, 'success');
    res.redirect('/operation-types');
}

export default { 
    all, 
    store, 
    update
};