import express from 'express';
import { createServer } from "node:http";
import connectToSocket from './src/controllers/socketManager.js';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './src/routes/userRoutes.js';

const app = express();


const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({ limit: "40kb", extended: false }));
app.use("/user", userRoutes);


const start = async () => {
    const connectionDb = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");
    server.listen(app.get("port"), () => {
        console.log('Server is running on port 3000');
    });
}
start();