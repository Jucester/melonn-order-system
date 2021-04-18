  
import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/melonn_default", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB Connected');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;