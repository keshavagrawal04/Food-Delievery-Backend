import { Food } from "../models/food.model";

export const saveFood = async (vendorId: string, body: any, vendor: any) => {
  try {
    const food = await Food.create({
      ...body,
      vendorId,
      rating: 0,
    });
    vendor.foods.push(food);
    await vendor.save();
    return food;
  } catch (error) {
    throw error;
  }
};

export const findFoodsByVendorId = async (vendorId: string) => {
  try {
    const foods = await Food.find({ vendorId });
    return foods;
  } catch (error) {
    throw error;
  }
};
