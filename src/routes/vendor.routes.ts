import express from "express";
import { vendorControllers } from "../controllers";
import { authMiddleware, multerMiddleware } from "../middlewares";

const router = express.Router();

router.post("/login", vendorControllers.vendorLogin);

router.use(authMiddleware.verifyToken);
router.get("/profile", vendorControllers.getVendorProfile);
router.patch("/profile", vendorControllers.updateVendorProfile);
router.patch(
  "/coverImages",
  multerMiddleware.uploadImage.array("coverImages", 10),
  vendorControllers.updateVendorCoverImages
);
router.patch("/service", vendorControllers.updateVendorService);

router.post(
  "/food",
  multerMiddleware.uploadImage.array("images", 10),
  vendorControllers.addFood
);
router.get("/foods", vendorControllers.getAllFoods);

export { router as vendorRoutes };
