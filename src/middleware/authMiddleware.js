import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Not authorized, token missing');
      err.status = 401;
      throw err;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      const err = new Error('Not authorized, user not found');
      err.status = 401;
      throw err;
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('User not authenticated');
      err.status = 401;
      return next(err);
    }
    if (!roles.includes(req.user.role)) {
      const err = new Error('User role not authorized');
      err.status = 403;
      return next(err);
    }
    next();
  };
};