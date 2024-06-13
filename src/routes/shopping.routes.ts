import express from "express";
import { shoppingControllers } from "../controllers";
const router = express.Router();

router.get("/:pincode", shoppingControllers.getFoodAvailability);
router.get("/top-restaurants/:pincode", shoppingControllers.getTopRestaurants);
router.get("/foods-in-30-min/:pincode", shoppingControllers.getFoodIn30Min);
router.get("/search/:pincode", shoppingControllers.searchFoods);
router.get("/restaurant/:id", shoppingControllers.getRestaurantById);

export { router as shoppingRoutes };
