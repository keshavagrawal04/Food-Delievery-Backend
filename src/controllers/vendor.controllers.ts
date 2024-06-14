import { Request, Response } from "express";
import { foodDto, vendorDto } from "../dto";
import { vendorServices, foodServices } from "../services";
import { cloudinary, crypto, jwt } from "../utils";

export const vendorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = <vendorDto.VendorLoginInput>req.body;
    const vendor = await vendorServices.findVendorByEmail(email);

    if (!vendor)
      return res
        .status(404)
        .json({ message: "Vendor With This Email Is Not Found" });

    const isPasswordValid = await crypto.isHashValid(
      password,
      vendor.salt,
      vendor.password
    );

    if (!isPasswordValid)
      return res.status(400).json({ message: "Password Mismatch" });

    const tokens = jwt.generateTokens({
      vendorId: vendor._id,
      email: vendor.email,
    });

    return res.status(200).json({
      message: "Vendor  Logged In Successfully",
      vendor: { vendorId: vendor._id, email: vendor.email },
      tokens,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getVendorProfile = async (
  req: vendorDto.VendorRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) return res.status(404).json({ message: "Unauthorized User" });

    const vendor = await vendorServices.findVendorById(user.vendorId);

    if (!vendor)
      return res.status(404).json({ message: "Vendor Information Not Found" });

    return res
      .status(200)
      .json({ message: "Vendor Profile Retrieved Successfully", vendor });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateVendorProfile = async (
  req: vendorDto.VendorRequest,
  res: Response
) => {
  try {
    const user = req.user;
    const body = <vendorDto.VendorUpdateInput>req.body;

    if (!user) return res.status(404).json({ message: "Unauthorized User" });

    const existingVendor = await vendorServices.findVendorById(user.vendorId);

    if (!existingVendor)
      return res.status(404).json({ message: "Vendor Information Not Found" });

    const vendor = await vendorServices.updateVendorProfile(
      user.vendorId,
      body
    );

    return res
      .status(200)
      .json({ message: "Vendor Profile Updated Successfully" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateVendorCoverImages = async (
  req: vendorDto.VendorRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) return res.status(404).json({ message: "Unauthorized User" });

    const existingVendor = await vendorServices.findVendorById(user.vendorId);

    if (!existingVendor)
      return res.status(404).json({ message: "Vendor Information Not Found" });

    const files = req.files as [Express.Multer.File];
    const paths = files.map((file: Express.Multer.File) => file.path);
    const uploadPromises = paths.map((path) => cloudinary.upload(path));
    const imagesObj = await Promise.all(uploadPromises);
    const images = imagesObj.map((image) => image?.url);

    const vendor = await vendorServices.updateCoverImages(
      images,
      user.vendorId
    );

    return res
      .status(200)
      .json({ message: "Vendor Cover Images Updated Successfully" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateVendorService = async (
  req: vendorDto.VendorRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) return res.status(404).json({ message: "Unauthorized User" });

    const existingVendor = await vendorServices.findVendorById(user.vendorId);

    if (!existingVendor)
      return res.status(404).json({ message: "Vendor Information Not Found" });

    const vendor = await vendorServices.updateVendorService(
      user.vendorId,
      existingVendor.serviceAvailable
    );

    return res
      .status(200)
      .json({ message: "Vendor Service Updated Successfully" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const addFood = async (req: vendorDto.VendorRequest, res: Response) => {
  try {
    const user = req.user;
    const foodDetails = <foodDto.CreateFoodInput>req.body;

    if (!user) return res.status(404).json({ message: "Unauthorized User" });

    const vendor = await vendorServices.findVendorById(user.vendorId);

    if (!vendor)
      return res.status(404).json({ message: "Vendor Information Not Found" });

    const files = req.files as [Express.Multer.File];
    const paths = files.map((file: Express.Multer.File) => file.path);
    const uploadPromises = paths.map((path) => cloudinary.upload(path));
    const imagesObj = await Promise.all(uploadPromises);
    const images = imagesObj.map((image) => image?.url);

    const food = await foodServices.saveFood(
      user.vendorId,
      { ...foodDetails, images },
      vendor
    );

    return res.status(200).json({ message: "Food Added Successfully" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllFoods = async (
  req: vendorDto.VendorRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) return res.status(404).json({ message: "Unauthorized User" });

    const vendor = await vendorServices.findVendorById(user.vendorId);

    if (!vendor)
      return res.status(404).json({ message: "Vendor Information Not Found" });

    const foods = await foodServices.findFoodsByVendorId(user.vendorId);

    return res
      .status(200)
      .json({ message: "Foods Data Retrieved Successfully", foods });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
