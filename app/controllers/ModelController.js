import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import access from '../common/access.js';
import breadcrumb from '../common/breadcrumb.js';
import scriptPath from '../common/script-path.js';
import { message, setMessage } from '../common/message.js';

const all = async (req, res) => {
    const { id }= req.params;
    const brand = await Brand.findByPk(id);
    Model.belongsTo(Brand, { foreignKey: 'brand_id' });
    const models = await Model.findAll({ where: { brand_id: id}, order: [['title']], include: Brand});
    res.render('models', { 
        title: `Models of ${ brand.title }`,
        brand: brand.dataValues,
        models,
        access: access.high(req),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/brands', 'Brands'),
            breadcrumb.make('/#', brand.title)
        ])
    });
}

const create = async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/brands/${ id }/models`);
    }
    
    res.render('models/create', { 
        title: `Creating a model of "${ brand.title }"`,
        validator: scriptPath('validators/single/single-edit.js'),
        brand: brand.dataValues,
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/brands', 'Brand'),
            breadcrumb.make(`/brands/${ id }/models`, brand.title),
            breadcrumb.make('#', 'Creating....'),
        ])
    });
}

const store = async (req, res) => {
    const { brand_id, title } = req.body;
    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/brands/${ brand_id }/models`);
    }
    
    const brand = await Brand.findByPk(brand_id);
    const _title = `${ brand.title } ${ title }`;
    const model = { brand_id, title: _title };

    await Model.create(model);
    const max = await Model.max('id', { where: { brand_id }});

    setMessage(req, `Model "${title}" was created`, 'success');
    res.redirect(`/brands/${ brand_id }/models`);
}

const edit = async (req, res) => {
    const { id } = req.params;
    Model.belongsTo(Brand, { foreignKey: 'brand_id' });
    const model = await Model.findOne({ where: { id }, include: Brand });
    if (!model) {
        return res.redirect('/404');
    }

    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/brands/${ model.brand_id }/models`);
    }

    model.title = model.title.split(' ').splice(1).join(' ');
    
    res.render('models/edit', { 
        title: `Editing model "${ model.Brand.title } ${ model.title }"`,
        model: model.dataValues,
        validator: scriptPath('validators/single/single-edit.js'),
        msg: message(req),
        breadcrumb: breadcrumb.build([
            breadcrumb.make('/brands', 'Brands'),
            breadcrumb.make(`/brands/${ model.Brand.id }/models`, model.Brand.title),
            breadcrumb.make(`/brands/${ model.Brand.id }/models/${ model.id }/details`, model.title),
            breadcrumb.make('#', 'Edit...')
        ])
    });
}

const update = async (req, res) => {
    const { id, brand_id, title, activity } = req.body;

    if (!access.isAllow(req, access.high)) {
        return res.redirect(`/brands/${ brand_id }/models`);
    }

    const brand = await Brand.findByPk(brand_id);
    const _title = `${ brand.title } ${ title }`;
    const _activity = activity === 'on' ? true : false;
    const model = { title: _title, activity: _activity };

    await Model.update(model, { where: { id } });
    setMessage(req, `Model "${title}" was edited`, 'success');
    res.redirect(`/brands/${ brand_id }/models`);
  
}

const jsonByBrand = async (req, res) => {
    const { brand_id } = req.params;
    const models = await Model.findAll({ where: { activity: true, brand_id }});
    res.json(models);
}

export default { all, create, store, edit, update, jsonByBrand };
