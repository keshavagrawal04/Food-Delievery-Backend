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

export const findFoodsById = async (cart: any) => {
  try {
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item: { _id: any }) => item._id))
      .exec();
    return foods;
  } catch (error) {
    throw error;
  }
};
