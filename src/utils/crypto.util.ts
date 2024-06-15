import crypto from "crypto";

export const generateHash = (
  password: string,
  salt: string = crypto.randomBytes(32).toString("hex")
) => {
  try {
    const hash = crypto
      .pbkdf2Sync(password, salt, 100, 64, "sha256")
      .toString("hex");
    return { hash, salt };
  } catch (error) {
    throw error;
  }
};

export const generateOtp = async () => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let otpExpiry = new Date();
    otpExpiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, otpExpiry };
  } catch (error) {
    throw error;
  }
};

export const isHashValid = async (
  password: string,
  salt: string,
  hash: string
) => {
  try {
    const { hash: generatedHash } = await generateHash(password, salt);
    return hash === generatedHash;
  } catch (error) {
    throw error;
  }
};
