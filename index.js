require('dotenv').config();

const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');

const helpers = require('./app/common/helpers');
const routes = require('./app/routes');
const sequelize = require('./app/db/sequelize');

const app = express();

app.use(session({ secret: process.env.JWT_KEY, resave: false, saveUninitialized: true }));

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

    app.all('*', (req, res) => { 
      res.status(404).send('404! Page not found'); 
    }); 

    app.listen(process.env.PORT);
  } catch (e) {
    console.error('Can`t connect to database', e);
  }
}

init();