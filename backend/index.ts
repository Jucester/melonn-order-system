import dotenv from 'dotenv';
dotenv.config();
import app from './src/app';
import connectDB from './src/config/database';


function main() {
    connectDB();

    app.listen(app.get('PORT'), () => {
        console.log('Server on port ', app.get('PORT'))
    });
}


main();