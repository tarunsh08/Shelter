import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const user = await User.findOne({ email });
    if (user) return next(errorHandler(400, "User already exists"));

    await newUser.save();
    
    const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
    
    const { password: pass, ...rest } = newUser._doc;

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    res
      .cookie('refresh_token', refreshToken, { 
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000
      })
      .cookie('access_token', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000
      })
      .status(200)
      .json({
        ...rest,
        accessToken,
        message: 'Signup successful'
      });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credential"));
    
    const refreshToken = jwt.sign({ id: validUser._id }, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ id: validUser._id }, process.env.ACCESS_TOKEN_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    res
      .cookie("refresh_token", refreshToken, { 
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, 
      })
      .cookie("access_token", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, 
      })
      .status(200)
      .json({
        ...rest,
        accessToken,
        message: 'Signin successful'
      });
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    if (user) {
      const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const { password: pass, ...rest } = user._doc;
      
      res
        .cookie('refresh_token', refreshToken, { 
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000 
        })
        .cookie('access_token', accessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000 
        })
        .status(200)
        .json({
          ...rest,
          accessToken,
          message: 'Google signin successful'
        });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      
      await newUser.save();
      
      const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const { password: pass, ...rest } = newUser._doc;
      
      res
        .cookie('refresh_token', refreshToken, { 
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000 
        })
        .cookie('access_token', accessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000 
        })
        .status(200)
        .json({
          ...rest,
          accessToken,
          message: 'Google signup successful'
        });
    }
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    res
      .clearCookie("access_token", cookieOptions)
      .clearCookie("refresh_token", cookieOptions)
      .status(200)
      .json("User signed out successfully");
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      return next(errorHandler(401, 'No refresh token provided'));
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, 'Invalid refresh token'));
      }

      const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
      };

      res
        .cookie('access_token', newAccessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000
        })
        .status(200)
        .json({
          accessToken: newAccessToken,
          message: 'Token refreshed successfully'
        });
    });
  } catch (err) {
    next(err);
  }
};