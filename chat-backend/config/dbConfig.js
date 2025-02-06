const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/chat");
        console.log('Connected to MongoDB');
    }catch(err) {
        console.error('Failed to connect to MongoDB', err);
    }
}
connectDb()