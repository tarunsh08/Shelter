import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import Authrouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "*",
}));

app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/auth", Authrouter);
app.use("/api/listing", listingRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
