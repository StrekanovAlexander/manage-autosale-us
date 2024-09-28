require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const hbs = require('express-handlebars');
const paginate = require('express-paginate');
const cookieParser = require('cookie-parser');
// const session = require('express-session');

const helpers = require('./app/common/helpers');
const routes = require('./app/routes');
const sequelize = require('./app/db/sequelize');

const rowsLimit = 15;
const rowsMaxLimit = rowsLimit;

const app = express();

app.use(cookieParser());
app.use(fileUpload({}));
app.use(paginate.middleware(rowsLimit, rowsMaxLimit));

// app.use(session({ 
//   secret: process.env.SESS_UUID, 
//   saveUninitialized: true,
//   resave: true,
//   cookie: { maxAge: 86400000 } 
// }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.engine('.hbs', hbs.engine({ extname: '.hbs', helpers }));
app.set('view engine', '.hbs');
app.set('views', './app/views');

async function init() { 
  try {
    await sequelize.authenticate();

    app.use('/', routes.home);
    app.use('/accounts', routes.accounts);
    app.use('/api', routes.api);
    app.use('/brands', routes.brands);
    app.use('/lots', routes.lots);
    app.use('/operations', routes.operations);
    app.use('/operation-types', routes.operationTypes);
    app.use('/reports', routes.reports);
    app.use('/users', routes.users);
    app.use('/vehicle-styles', routes.vehicleStyles);
    app.all('*', (req, res) => { 
      res.status(404).send('404! Page not found'); 
    }); 

    app.listen(process.env.PORT);
  } catch (e) {
    console.error('Can`t connect to database', e);
  }
}

init();