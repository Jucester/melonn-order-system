const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();

// routes
const OrdersRoutes = require('./routes/orders.routes');

const app = express();

// Middlewares
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/1.0/orders', OrdersRoutes)

// Error Handler


module.exports = app;