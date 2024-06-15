import express from "express";
import { customerControllers } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = express.Router();

router.post("/signup", customerControllers.customerSignUp);
router.post("/login", customerControllers.customerLogin);

router.use(authMiddleware.verifyToken);
router.patch("/verify", customerControllers.verifyCustomer);
router.get("/otp", customerControllers.getOtp);
router.get("/profile", customerControllers.customerProfileView);
router.patch("/profile", customerControllers.customerProfileUpdate);

router.post("/create-order", customerControllers.createOrder);
router.get("/orders", customerControllers.getOrders);
router.get("/order/:id", customerControllers.getOrderById);

export { router as customerRoutes };
