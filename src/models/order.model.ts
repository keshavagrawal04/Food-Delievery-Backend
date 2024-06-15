import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string;
  items: [any];
  totalAmount: number;
  orderDate: Date;
  paymentMethod: string;
  paymentResponse: boolean;
  orderStatus: string;
}

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date },
    paymentMethod: { type: String },
    paymentResponse: { type: Boolean },
    orderStatus: { type: String },
  },

  {
    toJSON: {
      transform(_, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("order", orderSchema);

export { Order };
