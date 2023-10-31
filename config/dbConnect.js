import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected ${connected.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};
export default dbConnect;
