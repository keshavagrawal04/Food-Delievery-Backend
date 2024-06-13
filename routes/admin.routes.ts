import express from "express";
import { adminControllers } from "../controllers";

const router = express.Router();

router.post("/vendor", adminControllers.createVendor);
router.get("/vendors", adminControllers.getVendors);
router.get("/vendor/:id", adminControllers.getVendorById);

export { router as adminRoutes };
