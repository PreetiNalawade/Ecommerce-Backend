import asyncHandler from "express-async-handler";
import Review from "../model/Reviews.js";
import Product from "../model/Product.js";

// @desc Create new Review
// @route POST /api/v1/review
// @access Public
export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.params;
  //1. Find the product
  const { productId } = req.params;
  const productFound = await Product.findById(productId).populate("reviews");
  if (!productFound) {
    throw new Error("Product not found!");
  }

  //Duplication of Reviews -check if the user already reviewed
  const hasReviewed = productFound?.reviews?.find((r) => {
    return r?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("You have already reviewed the product!");
  }

  //Create Review
  const review = await Review.create({
    message,
    rating,
    product: productFound._id,
    user: req.userAuthId,
  });
  // Push Reviews into the product found
  productFound.reviews.push(review?._id);
  await productFound.save();
  res.json({
    status: "Success",
    message: "Review created successfully!",
  });
});
