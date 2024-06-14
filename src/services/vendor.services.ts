import { Vendor } from "../models";

export const findVendorByEmail = async (email: string) => {
  try {
    const vendor = await Vendor.findOne({ email });
    return vendor;
  } catch (error) {
    throw error;
  }
};

export const findVendorByPincode = async (pinCode: string) => {
  try {
    const vendors = await Vendor.find({ pinCode })
      .sort([["rating", "descending"]])
      .populate("foods");
    return vendors;
  } catch (error) {
    throw error;
  }
};

export const findTopVendors = async (pinCode: string) => {
  try {
    const vendors = await Vendor.find({
      pinCode,
    })
      .sort([["rating", "descending"]])
      .limit(5);
    return vendors;
  } catch (error) {
    throw error;
  }
};

export const findFoodsIn30Mins = async (pinCode: string) => {
  try {
    const vendors = await Vendor.find({
      pinCode,
    }).populate("foods");
    return vendors;
  } catch (error) {
    throw error;
  }
};

export const searchFoods = async (pinCode: string) => {
  try {
    const vendors = await Vendor.find({ pinCode }).populate("foods");
    return vendors;
  } catch (error) {
    throw error;
  }
};

export const findVendorById = async (id: string) => {
  try {
    const vendor = await Vendor.findById({ _id: id });
    return vendor;
  } catch (error) {
    throw error;
  }
};

export const updateVendorProfile = async (id: string, body: any) => {
  try {
    const vendor = await Vendor.findOneAndUpdate({ _id: id }, body);
    return vendor;
  } catch (error) {
    throw error;
  }
};

export const updateVendorService = async (
  id: string,
  serviceAvailability: boolean
) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: id },
      { serviceAvailable: !serviceAvailability }
    );
    return vendor;
  } catch (error) {
    throw error;
  }
};
