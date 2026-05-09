import mongoose from "mongoose";
import { config } from "./config.js";
const connectDB = async () => {
    const mongoUri = config.MONGO_URIc || config.MONGO_URI || process.env.MONGO_URI || process.env.MONGO_URIc;
    if (!mongoUri || typeof mongoUri !== "string") {
        console.error("Error: MongoDB URI is not defined. Set MONGO_URI or MONGO_URIc.");
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
export default connectDB;