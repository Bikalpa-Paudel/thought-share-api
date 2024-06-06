// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import otpRoutes from "./routes/otpRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const MONGO_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/test';

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/otp', otpRoutes);
app.use('/auth', authRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});