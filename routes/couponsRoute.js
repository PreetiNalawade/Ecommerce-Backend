import exppress from "express";
import {
  createCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
} from "../controllers/couponCtrl.js";
//import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const couponsRouter = exppress.Router();

couponsRouter.post("/", isLoggedIn, createCouponCtrl);
couponsRouter.get("/", getAllCouponsCtrl);
couponsRouter.get("/single", getCouponCtrl);
couponsRouter.put("/:id", isLoggedIn, updateCouponCtrl);
couponsRouter.delete("/:id", isLoggedIn, deleteCouponCtrl);

export default couponsRouter;
