import { Request } from "express";
import { AuthPayload } from "./auth.dto";

export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodTypes: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface VendorUpdateInput {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}

export interface VendorPayload {
  vendorId: string;
  email: string;
}

export interface VendorRequest extends Request {
  user?: AuthPayload;
}
