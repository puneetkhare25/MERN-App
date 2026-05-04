const mongoose = require("mongoose");

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_DB;

        if (!uri) {
            throw new Error("MONGO_DB environment variable is not defined");
        }

        await mongoose.connect(uri);
        console.log("DB Connected");
    } catch (err: unknown) {
        console.error("DB Connection Error:", (err as Error).message);
        process.exit(1);
    }
};

module.exports = connectDB;