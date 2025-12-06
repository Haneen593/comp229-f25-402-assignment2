import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import projectRoutes from "./routes/project.routes.js";
import educationRoutes from "./routes/education.routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Express App Configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Configuration (must come before routes)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Routes Configuration
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", contactRoutes);
app.use("/", projectRoutes);
app.use("/", educationRoutes);

// Error Handling Configuration
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ "error" : err.name + ": " + err.message  })
    }else if (err){
        res.status (400).json ({"error" : err.name + ": " + err.message })
        console.log(err)
    }
});

// Mongoose Configuration
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
    process.exit(1);
  });
mongoose.connection.on("error", (err) => {
  console.error('unable to connect to database!', err);
});

// Server Configuration
app.get("/", (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server: http://localhost:%s", PORT);
});

export default app;
