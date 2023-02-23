// Dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const handlebarsexpress = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');

// Create a new sequelize store using the express-session package
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js
const hbs = handlebarsexpress.create({ helpers });

// Configure and link a session object
const sess = {
  secret: process.env.SECRET,
  cookie: {maxAge: 300000},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Add express-session and store as Express.js middleware
app.use(session(sess));

// Set Handlebars as the default template engine.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to html, css, js
app.use(express.static(path.join(__dirname, 'public')));

//to use routes
app.use(routes);

// Starts the server to begin listening
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening on'));
});