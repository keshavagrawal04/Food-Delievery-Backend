import { Order } from "../models";

export const saveOrder = async (body: any) => {
  try {
    const order = await Order.create(body);
    await order.save();
    return order;
  } catch (error) {
    throw error;
  }
};

export const findOrderById = async (id: string) => {
  try {
    const order = await Order.findById({ _id: id }).populate("items.food");
    return order;
  } catch (error) {
    throw error;
  }
};
