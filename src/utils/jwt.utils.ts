import jwt from "jsonwebtoken";

export const generateTokens = (payload: any) => {
  try {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET as string, {
      expiresIn: "1d",
    });
    return { access: accessToken };
  } catch (error) {
    throw error;
  }
};
