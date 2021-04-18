require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/configs/database');

connectDB();

app.listen(app.get('PORT'), () => {
    console.log('Server on port ', app.get('PORT'))
});