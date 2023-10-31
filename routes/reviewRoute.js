import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/reviewsCtrl.js";

const reviewRouter = express.Router();
reviewRouter.use("/:productId", isLoggedIn, createReviewCtrl);

export default reviewRouter;
