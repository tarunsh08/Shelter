import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token; 
    
    if (!token) {
        return next(errorHandler(401, 'Unauthorized - No access token provided'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err.message);
            if (err.name === 'TokenExpiredError') {
                return next(errorHandler(403, 'Session expired. Please log in again.'));
            }
            return next(errorHandler(403, 'Forbidden - Invalid token'));
        }
        
        req.user = user;
        next();
    });
};
