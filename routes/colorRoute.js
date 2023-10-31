import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createColorCtrl,
  deleteColorCtrl,
  getAllColorsCtrl,
  getSingleColorCtrl,
  updateColorCtrl,
} from "../controllers/colorCtrl.js";

const colorRouter = express.Router();

colorRouter.post("/", isLoggedIn, createColorCtrl);
colorRouter.get("/", getAllColorsCtrl);
colorRouter.get("/:id", getSingleColorCtrl);
colorRouter.put("/:id", updateColorCtrl);
colorRouter.delete("/:id", isLoggedIn, deleteColorCtrl);

export default colorRouter;
