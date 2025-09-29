import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import Authrouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";

dotenv.config();

connectDB();
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Use CORS with the imported options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Test route
app.get("/test", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", Authrouter);
app.use("/api/listing", listingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
