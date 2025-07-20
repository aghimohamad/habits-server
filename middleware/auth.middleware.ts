import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { JWT_SECRET } from "../config/env.ts";
import { Request, Response, NextFunction } from "express";
const authorize = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(req.headers, "token");
    if (!token) {
      const error = new Error("Not authenticated.");
      (error as any).statusCode = 401;
      throw error;
    }
    const decoded = verify(token, JWT_SECRET as string) as { userId: string };
    console.log(decoded, "decoded");
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    res.status(400).json({ message: "unauthorized", error: error.message });
  }
};

export default authorize;
