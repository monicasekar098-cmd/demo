const mongoose = require("mongoose");

async function connectDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/blognest");

        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

module.exports = connectDatabase;