import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createOrderCtrl,
  getAllordersCtrl,
  getSingleOrder,
  updateOrderCtrl,
  getOrderStatsCtrl,
} from "../controllers/orderCtrl.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrder);
orderRouter.put("/:id", isLoggedIn, updateOrderCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);

export default orderRouter;
