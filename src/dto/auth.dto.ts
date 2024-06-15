import { VendorPayload } from "./vendor.dto";
import { CustomerPayload } from "./customer.dto";
import { Request } from "express";

export type AuthPayload = VendorPayload | CustomerPayload;

export interface CustomAuthRequest extends Request {
  user?: AuthPayload;
}
