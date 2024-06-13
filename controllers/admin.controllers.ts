import { Request, Response } from "express";
import { vendorDto } from "../dto";
import { adminServices } from "../services";
import { crypto } from "../utils";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendor = <vendorDto.CreateVendorInput>req.body;
    const isVendorExists = await adminServices.findVendorByEmail(vendor.email);

    if (isVendorExists)
      return res
        .status(400)
        .json({ message: "Vendor With This Email Is Already Exists" });

    const { hash, salt } = await crypto.generateHash(vendor.password);

    vendor.password = hash;

    const createdVendor = await adminServices.saveVendor({
      ...vendor,
      salt,
      rating: 0,
      coverImages: [],
    });
    return res
      .status(201)
      .json({ message: "Vendor Created Successfully", createdVendor });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await adminServices.findAllVendors();
    return res
      .status(201)
      .json({ message: "Vendors Data Retrieved Successfully", vendors });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendor = await adminServices.findVendorById(id);
    return res
      .status(201)
      .json({ message: "Vendor Data Retrieved Successfully", vendor });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
