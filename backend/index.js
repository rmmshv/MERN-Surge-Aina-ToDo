import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";

const PORT = process.env.PORT || 5500;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/todos", todoRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
    connectDB();
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
}

export default app;