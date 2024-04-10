import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectToDB } from "./database/connect.js";
import rootRouter from "./routes/index.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/v1", rootRouter);

const startServer = async () => {
  try {
    await connectToDB(process.env.MONGODB_URL);
    app.listen(8080, () => {
      console.log("Server has started on port http://localhost:8080");
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
