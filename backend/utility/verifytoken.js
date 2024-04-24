import jwt from "jsonwebtoken";
import { createError } from "../utility/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("Access Token", token)
  if (!token) {
    return res.status(401).json({error: "You are not Authenticated"})
  }
  try{
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=> {
      if(err) return next(createError(403, "Token is not valid"))
      req.user = user;
    next()
    })
  }
  catch(err){
    next(createError(403, "Token is not valid!"))
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user._id === req.params._id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};