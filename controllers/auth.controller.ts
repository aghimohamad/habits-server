import pkg from 'jsonwebtoken';
const { sign } = pkg;
import pkg2 from 'bcrypt';
const { hash, compare, genSalt } = pkg2;

import User from "../models/user.model.ts";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.ts";
import { Request, Response, NextFunction } from "express";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error();
      error.message = "User with this email exists";
      (error as any).statusCode = 400; // Bad Request
      throw error;
    }

    const salt = await genSalt(10);
    const cryptedPassword = await hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: cryptedPassword,
    });

    const token = sign({ userId: newUser._id }, JWT_SECRET as string);

    res.status(201).json({
      payload: {
        user: newUser,
        token,
      },
      message: "user created successfully",
    });
  } catch (err: any) {
    next(err);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.find({ email });
    if (!user || user.length === 0) {
      const error = new Error();
      error.message = "User with this email does not exist";
      throw error;
    }
    const isPasswordValid = await compare(password, user[0].password);
    if (!isPasswordValid) {
      const error = new Error();
      error.message = "Invalid password";
      throw error;
    }
    const token = sign({ userId: user[0]._id }, JWT_SECRET as string);
    res.cookie("jwt", token);

    res.status(200).json({
      payload: {
        user: user[0],
        token,
      },
      message: "User signed in successfully",
    });
  } catch (err: any) {
    next(err);
  }
};