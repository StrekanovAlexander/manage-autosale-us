const Specification = require('../models/Specification.js');
const SpecificationItem = require('../models/SpecificationItem.js');
const access = require('../common/access.js');
const breadcrumb = require('../common/breadcrumb.js');
const scriptPath = require('../common/script-path.js');
const { message, setMessage } = require('../common/message.js');

const all = async (req, res) => {
    const { id }= req.params;
    const specification = await Specification.findByPk(id);
    SpecificationItem.belongsTo(Specification, { foreignKey: 'specification_id' });
    const specificationItems = await SpecificationItem.findAll({ where: { specification_id: id}, 
        order: [['title']], include: Specification});
    res.render('specification-items', { 
        title: `Items in specification`,
        specification: specification.dataValues,
        specificationItems,
        access: access.high(req),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/specifications', 'Specifications'),
            breadcrumb.make('/#', specification.title)
        ])
    });
}

const create = async (req, res) => {
    const { id } = req.params;
    const specification = await Specification.findByPk(id);
    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/specifications/${ id }/specification-items`);
    }
    
    res.render('specification-items/create', { 
        title: `Creating item in specification`,
        validator: scriptPath('validators/single/single-edit.js'),
        specification: specification.dataValues,
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/specifications', 'Specification'),
            breadcrumb.make(`/specifications/${ id }/specification-items`, specification.title),
            breadcrumb.make('#', 'Creating....'),
        ])
    });
}

const store = async (req, res) => {
    const { specification_id, title } = req.body;

    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/specifications/${ specification_id }/specification-items`);
    }
    await SpecificationItem.create(req.body);
    setMessage(req, `Item in "${title}" specification was created`, 'success');
    res.redirect(`/specifications/${ specification_id }/specification-items`);
}

const edit = async (req, res) => {
    const { id } = req.params;
    SpecificationItem.belongsTo(Specification, { foreignKey: 'specification_id' });
    const specificationItem = await SpecificationItem.findOne({ where: { id }, include: Specification });
    if (!specificationItem) {
        return res.redirect('/404');
    }

    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/specifications/${ specificationItem.specification_id }/specification-items`);
    }

    res.render('specification-items/edit', { 
        title: `Specification item editing`,
        specificationItem: specificationItem.dataValues,
        validator: scriptPath('validators/single/single-edit.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/specifications', 'Specifications'),
            breadcrumb.make(`/specifications/${ specificationItem.Specification.id }/specification-items`, specificationItem.Specification.title),
            breadcrumb.make(`#`, specificationItem.title),
            breadcrumb.make('#', 'Edit...')
        ])
    });
}

const update = async (req, res) => {
    const { id, specification_id, title, activity } = req.body;

    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/specifications/${ specification_id }/specification-items`);
    }

    const specificationItem = {specification_id, title, activity: activity === 'on' ? true : false };
    await SpecificationItem.update(specificationItem, { where: { id } });
    setMessage(req, `Specification item "${title}" was edited`, 'success');
    res.redirect(`/specifications/${ specification_id }/specification-items`);
  
}

module.exports = { 
    all, 
    create, 
    store, 
    edit, 
    update
}
