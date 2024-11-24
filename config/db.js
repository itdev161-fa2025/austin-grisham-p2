import mongoose from 'mongoose';
import config from 'config';

const db = config.get('mongodbUri');

const connectDatabase = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); 
    }
};

export default connectDatabase;
