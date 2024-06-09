// src/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import otpRoutes from "./routes/otpRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes"
import cors from "cors";


dotenv.config();
const MONGO_URI = process.env.DATABASE_URI || "mongodb://localhost:27017/test";

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const app = express();
const port = 8080;
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/otp", otpRoutes);
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
