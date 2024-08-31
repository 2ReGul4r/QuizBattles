import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.routes.js";
//import boardRoutes from "./routes/board.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
//app.use("/api/board", boardRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running ${PORT}`);
});
