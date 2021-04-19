import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
//require('dotenv').config();

// routes import
import OrdersRoutes from './routes/orders.routes';
import UsersRoutes from './routes/users.routes';

// Initialize express
const app : Application = express();

// Settings
app.set('PORT', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev', { skip: (req : any , res : any ) => process.env.NODE_ENV === 'test' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/1.0/users', UsersRoutes);
app.use('/api/1.0/orders', OrdersRoutes);

// TODO: Error Handler

//console.log('Env: ', process.env.NODE_ENV);
export default app;