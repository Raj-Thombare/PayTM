import mongoose from "mongoose";

export const connectToDB = async (url) => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.log(err);
  }
};
