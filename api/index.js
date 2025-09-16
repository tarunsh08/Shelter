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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://real-estate-ac5w.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['set-cookie'],
  maxAge: 600
}));

app.options('*', cors());

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
