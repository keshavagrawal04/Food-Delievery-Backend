import twilio from "twilio";

export const sendOtp = async (otp: number, toPhoneNumber: string) => {
  try {
    const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
    const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
    const response = await client.messages.create({
      body: `Your Otp Is : ${otp}`,
      from: TWILIO_FROM_NUMBER,
      to: `+91${toPhoneNumber}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
