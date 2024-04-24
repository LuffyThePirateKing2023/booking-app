import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utility/error.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      });
      res.on('finish', () => {
        console.log("Cookie:", res.getHeaders()['set-cookie']);
      });
      res.status(200).json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};

export const forgotPass = async (req, res, next) => {
  const {email} = req.body;
  try{
    const oldUser = await User.findOne({email});
    
    if(!oldUser){
      return res.status(404).json({message: "User not found!"})
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret, {
      expiresIn: "2h"
    });
    const link = `http://localhost:3000/resetpassword/${oldUser._id}/${token}/${oldUser.username}`;

    const transporter = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_SECRET_KEY
      }
    });

    const mailOption = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<p>Please click the following link to reset your password:<br>
      <a href="${link}">${link}</a><br>
      this link is expire within 2 Hours.
      </p>`
    };

    transporter.sendMail(mailOption,(err, info) => {
      if(err){
        console.error('Error Sending Mail', err);
        return res.status(500).json({message: "Failed to send Email"});
      }
      console.log('Email Sent', info.response);
      return res.status(200).json({message: "Email sent Succesfully. Please check your Inbox and Spam Folder"})
    });
  }
  catch(err){
    next(err)
  }
}

export const resetpassword = async (req, res, next) => {
 const { id } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret,);
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.status(200).json({email: verify.email, status: "Verified"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Something Went Wrong" });
  }
};