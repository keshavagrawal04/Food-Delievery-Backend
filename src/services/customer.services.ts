import { Customer } from "../models";

export const saveCustomer = async (body: any) => {
  try {
    const customer = await Customer.create(body);
    await customer.save();
    return customer;
  } catch (error) {
    throw error;
  }
};

export const findCustomerById = async (id: string) => {
  try {
    const customer = await Customer.findById({ _id: id });
    return customer;
  } catch (error) {
    throw error;
  }
};

export const findCustomerByEmail = async (email: string) => {
  try {
    const customer = await Customer.findOne({ email });
    return customer;
  } catch (error) {
    throw error;
  }
};

export const updateCustomer = async (id: string, body: any) => {
  try {
    const customer = await Customer.findByIdAndUpdate({ _id: id }, body, {
      new: true,
    });
    return customer;
  } catch (error) {
    throw error;
  }
};

export const findOrdersByCustomerId = async (id: string) => {
  try {
    const orders = await Customer.findById(id).populate("orders");
    return orders;
  } catch (error) {
    throw error;
  }
};
