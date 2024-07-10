require('dotenv').config();
const express = require('express');
const sequelize = require('./app/db/sequelize');
const routes = require('./app/routes');
const hbs = require('express-handlebars');
const helpers = require('./app/common/helpers');
const app = express();

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
    app.listen(process.env.PORT);
  } catch (e) {
    console.error('Can`t connect to database', e);
  }
}

init();
