const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectdb = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || 'mongodb+srv://jaykanjariya009:Jay%402004@cluster0.2wwtnns.mongodb.net/',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("Error connecting to DB", error);
        process.exit(1);
    }
};

module.exports = connectdb;
