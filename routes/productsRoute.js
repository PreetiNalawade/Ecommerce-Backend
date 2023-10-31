import express from "express";
import dotenv from "dotenv";
dotenv.config();
import upload from "../config/fileUpload.js";
import {
  createProductCtrl,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, upload.array("files"), createProductCtrl);
productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
productsRouter.put("/:id", isLoggedIn, updateProductCtrl);
productsRouter.delete("/:id", isLoggedIn, deleteProductCtrl);

export default productsRouter;
