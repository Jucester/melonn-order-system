const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();

// routes import
const OrdersRoutes = require('./routes/orders.routes');
const UsersRoutes = require('./routes/users.routes');

const app = express();

// Settings
app.set('PORT', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/1.0/users', UsersRoutes);
app.use('/api/1.0/orders', OrdersRoutes);

// TODO: Error Handler

//console.log('Env: ', process.env.NODE_ENV);
module.exports = app;