import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization; // Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  // console.log("Testing Token 1: ", token);
  // console.log("Testing Token 1: ", token !== "null");
  // console.log("Testing Token 1: ", authHeader);

  if (!token) {
    res.status(401).json({ message: "Unauthorized, token expired" });
    return;
  }

  // console.log("Testing Token 2: ", token);

  const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
    algorithms: ["RS256"],
  });

  // console.log("Testing Token 3: ", token);

  if (!decoded) {
    res.status(401).json({ message: "Unauthorized, jwt key error" });
    return;
  }

  console.log("Decoded: ", decoded);

  const userId = (decoded as any).sub;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized User" });
    return;
  }

  req.userId = userId;
  next();
};
