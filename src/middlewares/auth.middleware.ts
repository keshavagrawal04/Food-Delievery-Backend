import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authDto } from "../dto";
import { AuthPayload } from "../dto/auth.dto";

export const verifyToken = async (
  req: authDto.CustomAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.get("Authorization");
    if (!authorization)
      return res
        .status(404)
        .json({ message: "Authorization Header Not Provided" });

    const token = authorization?.split(" ")[1];
    if (!token) return res.status(404).json({ message: "Unauthorized User" });

    const payload = jwt.verify(
      token,
      process.env.ACCESS_SECRET as string
    ) as AuthPayload;
    req.user = payload;
    next();
  } catch (error) {
    throw error;
  }
};
