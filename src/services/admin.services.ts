import { Vendor } from "../models";

export const saveVendor = async (vendorDetails: any) => {
  try {
    const vendor = await Vendor.create(vendorDetails);
    return vendor;
  } catch (error) {
    throw error;
  }
};

export const findAllVendors = async () => {
  try {
    const vendors = await Vendor.find({});
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

export const findVendorByEmail = async (email: string) => {
  try {
    const vendor = await Vendor.findOne({ email });
    return vendor;
  } catch (error) {
    throw error;
  }
};
