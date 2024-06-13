import mongoose from "mongoose";

export const connect = async () => {
  try {
    const { connection } = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
    console.log(`✅ Database Connection Success : ${connection.host}`);
  } catch (error: any) {
    console.log(`❌ Database Connection Failed : ${error.message}`);
  }
};
