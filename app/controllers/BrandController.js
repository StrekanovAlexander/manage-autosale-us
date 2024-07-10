const { Op } = require('sequelize');
const Brand = require('../models/Brand.js');
const access = require('../common/access.js');
const breadcrumb = require('../common/breadcrumb.js');
const scriptPath = require('../common/script-path.js');
const { message, setMessage } = require('../common/message.js');

const all = async (req, res) => {
    const brands = await Brand.findAll({ order: [['title']] });
    res.render('brands', { 
        title: 'Brands',
        brands,
        access: access.high(req),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/brands', 'Brands')
        ])
    });
}

const create = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/brands');
    }

    res.render('brands/create', { 
        title: 'Brand creating',

        validator: scriptPath('validators/single/single-edit.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/brands', 'Brands'),
            breadcrumb.make('#', 'Create....'),
        ])
    });
}

const store = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/brands');
    }
    
    const { title } = req.body;
    const brand = await Brand.findOne({ where: { title: title.trim() } });
    
    if (brand) {
        setMessage(req, `Brand "${title}" already exists`, 'danger');
        return res.redirect('/brands/create');
    }
    
    await Brand.create({ title });
    
    setMessage(req, `Brand "${title}" was created`, 'success');
    res.redirect('/brands');
}

const edit = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/brands');
    }
    const { id } = req.params;
    const brand = await Brand.findOne({ where: { id } });

    res.render('brands/edit', {
        title: `Brand "${ brand.title }" editing`,
        brand: brand.dataValues,
        validator: scriptPath('validators/single/single-edit.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/brands', 'Brands'),
            breadcrumb.make('#', brand.title),
            breadcrumb.make('#', 'Edit...'),
        ])
    });
}

const update = async (req, res) => {
    if (!access.isAllow(req, access.high)) {
        return res.redirect('/brands');
    }
    const { id, title, activity } = req.body;
    let brand = await Brand.findOne({ where: { id: { [Op.ne]: id }, title: title }});
    if (brand) {
        setMessage(req, `Brand "${ title }" is already usings`, 'danger');
        return res.redirect(`/brands/${ id }/edit`);    
    }

    const _activity = activity === 'on' ? true : false;

    await Brand.update({ title, activity: _activity }, { where: { id } });
    setMessage(req, `Brand ${ title } was edited`, 'success');

    res.redirect('/brands');
}

module.exports = { 
    all, 
    create, 
    store, 
    edit, 
    update
};