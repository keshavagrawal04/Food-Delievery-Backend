import { Request, Response } from "express";
import { vendorServices } from "../services";
import { FoodDoc } from "../models";

export const getFoodAvailability = async (req: Request, res: Response) => {
  try {
    const { pincode: pinCode } = req.params;

    const vendors = await vendorServices.findVendorByPincode(pinCode);

    return res.status(200).json({
      message: "Available Vendors Data Retrieved Successfully",
      vendors,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getTopRestaurants = async (req: Request, res: Response) => {
  try {
    const { pincode: pinCode } = req.params;

    const vendors = await vendorServices.findTopVendors(pinCode);

    return res.status(200).json({
      message: "Available Vendors Data Retrieved Successfully",
      vendors,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getFoodIn30Min = async (req: Request, res: Response) => {
  try {
    const { pincode: pinCode } = req.params;

    const vendors = await vendorServices.findFoodsIn30Mins(pinCode);

    if (vendors.length <= 0)
      return res.status(404).json({ message: "Foods In 30 Minutes Not Found" });

    let results: any = [];

    vendors.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      results.push(...foods.filter((food) => food.readyTime <= 30));
    });

    return res.status(200).json({
      message: "30 Minutes Foods Data Retrieved Successfully",
      vendors,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const searchFoods = async (req: Request, res: Response) => {
  try {
    const { pincode: pinCode } = req.params;

    const vendors = await vendorServices.findTopVendors(pinCode);

    const foods: any = [];
    vendors.map((vendor) => {
      foods.push(...vendor.foods);
    });

    return res.status(200).json({
      message: "Available Vendors Data Retrieved Successfully",
      foods,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
