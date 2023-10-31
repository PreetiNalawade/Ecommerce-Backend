import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createBrandCtrl,
  deleteBrandCtrl,
  getAllBrandsCtrl,
  getSingleBrandCtrl,
  updateBrandCtrl,
} from "../controllers/brandCtrl.js";

const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn, createBrandCtrl);
brandRouter.get("/", getAllBrandsCtrl);
brandRouter.get("/:id", getSingleBrandCtrl);
brandRouter.put("/:id", updateBrandCtrl);
brandRouter.delete("/:id", isLoggedIn, deleteBrandCtrl);

export default brandRouter;
