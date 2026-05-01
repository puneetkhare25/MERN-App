const mongoose = require('mongoose');

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log("✅ DB Connected");
    } catch (err: any) {
        console.error("❌ DB Connection Error :", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;