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
import config from "../config/config.js";
import mongoose from "mongoose";

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
  .connect(config.mongoUri, {
    
  })
  .then(() => {
    console.log("Connected to the database!");
  });
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

// Server Configuration
app.get("/", (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});
app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server: http://localhost:%s", config.port);
});

export default app;
