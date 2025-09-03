import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // console.log(token);
    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            console.log(err.message);
            return next(errorHandler(403, 'Forbidden'));
        }
        // const temp_user = await User.findById(user.id)
        // console.log(temp_user.username);
        req.user = user;
        next();
    })
}
