import express from "express";
import categoryUpload from "../config/categoryUpload.js";

import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/categoryCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  isLoggedIn,
  categoryUpload.single("file"),
  createCategoryCtrl
);
categoryRouter.get("/", getAllCategoriesCtrl);
categoryRouter.get("/:id", getSingleCategoryCtrl);
categoryRouter.put("/:id", updateCategoryCtrl);
categoryRouter.delete("/:id", isLoggedIn, deleteCategoryCtrl);

export default categoryRouter;
