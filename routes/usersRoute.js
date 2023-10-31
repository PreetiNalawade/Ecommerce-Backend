import express from "express";
import {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  updateShippingAddress,
} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();
userRoutes.post("/api/v1/users/register", registerUserCtrl);
userRoutes.post("/api/v1/users/login", loginUserCtrl);
userRoutes.get("/api/v1/users/profile", isLoggedIn, getUserProfileCtrl);
userRoutes.put(
  "/api/v1/users/update/shipping",
  isLoggedIn,
  updateShippingAddress
);

export default userRoutes;
