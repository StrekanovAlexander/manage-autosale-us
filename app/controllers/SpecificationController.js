import { Op } from 'sequelize';
import Specification from '../models/Specification.js';
import access from '../common/access.js';
import breadcrumb from '../common/breadcrumb.js';
import scriptPath from '../common/script-path.js';
import { message, setMessage } from '../common/message.js';

const all = async (req, res) => {
    const specifications = await Specification.findAll({ order: [['title']] });
    res.render('specifications', { 
        title: 'Specifications',
        specifications,
        access: access.high(req),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/specifications', 'Specifications')
        ])
     });
}

const create = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/specifications');
    }
    res.render('specifications/create', { 
        title: 'Specification creating',
        validator: scriptPath('validators/single/single-edit.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/specifications', 'Specifications'),
            breadcrumb.make('#', 'Create....'),
        ])
    });
}

const store = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/specifications');
    }
    const { title } = req.body;
    const specification = await Specification.findOne({ where: { title: title.trim() } });
    if (specification) {
        setMessage(req, `Specification "${title}" already exists`, 'danger');
        return res.redirect('/specifications/create');
    }
    
    await Specification.create({ title });
    setMessage(req, `Specification ${title} was created`, 'success');
    res.redirect('/specifications');
}

const edit = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/specifications');
    }
    const { id } = req.params;
    const specification = await Specification.findByPk(id);

    res.render('specifications/edit', {
        title: `Specification editing "${ specification.title }"`,
        specification: specification.dataValues,
        validator: scriptPath('validators/single/single-edit.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/specifications', 'Specifications'),
            breadcrumb.make('#', specification.title),
            breadcrumb.make('#', 'Edit...'),
        ])
    });
}

const update = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/specifications');
    }
    const { id, title, activity } = req.body;
    const specification = await Specification.findOne({ attributes: ['id', 'title'], 
        where: { id: { [Op.ne]: id }, title: title }
    });
    if (specification) {
        setMessage(req, `Specification "${ title }" already using`, 'danger');
        return res.redirect(`/specifications/${ id }/edit`);    
    }
    await Specification.update({ title, activity: activity === 'on' ? true : false }, { where: { id } });
    setMessage(req, `Specification "${ title }" was edited`, 'success');

    res.redirect('/specifications');
}

export default { all, create, store, edit, update };