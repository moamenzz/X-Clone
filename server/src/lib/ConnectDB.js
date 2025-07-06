import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMONGODB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${connect.connection.host}`);
  } catch (e) {
    console.error("Error connecting to MongoDB", e);
    process.exit(1);
  }
};

export default connectMONGODB;
