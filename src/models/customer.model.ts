import mongoose, { Schema, Document } from "mongoose";
import { OrderDoc } from "./order.model";

export interface CustomerDoc extends Document {
  email: string;
  phone: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  otp: number;
  otpExpiry: Date;
  verified: boolean;
  lat: number;
  lan: number;
  orders: [OrderDoc];
}

const customerSchema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    otp: { type: Number, required: true },
    otpExpiry: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    lat: { type: Number, default: 0 },
    lan: { type: Number, default: 0 },
    orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.password,
          delete ret.salt,
          delete ret.createdAt,
          delete ret.updatedAt,
          delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", customerSchema);

export { Customer };
