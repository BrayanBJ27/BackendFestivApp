import mongoose from 'mongoose';

const connectMongo = async (): Promise<void> => {
    try {
        await mongoose.connect('mongodb://localhost:27017/FestivApp');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectMongo;
