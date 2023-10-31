import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

// @desc Create new Brand
// @route POST /api/v1/brand
// @access Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //brand check
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists!");
  }
  //create category
  const brand = await Brand.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: " Success",
    message: "Brand created successfully!",
    brand,
  });
});

// @desc Get All Brands
// @route GET /api/v1/brand
// @access Public
export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.json({
    status: "Success",
    message: "All Categories fetched successfully!",
    brands,
  });
});

// @desc Get Brand by ID
// @route GET /api/v1/brand/:id
// @access Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const singleBrand = await Brand.findById(req.params.id);
  if (!singleBrand) {
    throw new Error(" No category found!");
  }
  res.json({
    status: "success",
    message: "Category found successfully!",
    singleBrand,
  });
});

// @desc Update Brand
// @route Put /api/v1/brand/:id
// @access Public
export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const updateBrand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "Success",
    message: "Category updated Successfully!",
    updateBrand,
  });
});

// @desc Delete Brand
// @route Delete /api/v1/brand/:id
// @access Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Category Deleted Successfully!",
  });
});
