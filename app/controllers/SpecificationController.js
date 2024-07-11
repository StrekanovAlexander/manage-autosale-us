const { Op } = require('sequelize');
const Specification = require('../models/Specification.js');
const access = require('../common/access.js');
const breadcrumb = require('../common/breadcrumb.js');
const scriptPath = require('../common/script-path.js');
const { message, setMessage } = require('../common/message.js');

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

module.exports = { 
    all, 
    create, 
    store, 
    edit, 
    update
}