import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

// @desc Create new Category
// @route POST /api/v1/categories
// @access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  //const convertedImgs = req.file.map((file) => file.path);
  const { name } = req.body;
  //category check
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already Found!");
  }
  //create category
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path,
  });
  res.json({
    status: " Success",
    message: "Category created successfully!",
    category,
  });
});

// @desc Get All Category
// @route GET /api/v1/categories
// @access Public
export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    status: "Success",
    message: "All Categories fetched successfully!",
    categories,
  });
});

// @desc Get Single Category
// @route GET /api/v1/categories
// @access Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const singleCategory = await Category.findById(req.params.id);
  if (!singleCategory) {
    throw new Error(" No category found!");
  }
  res.json({
    status: "success",
    message: "Category found successfully!",
    singleCategory,
  });
});

// @desc Update Category
// @route GET /api/v1/categories/:id
// @access Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const updateCategory = await Category.findByIdAndUpdate(
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
    updateCategory,
  });
});

// @desc Delete Category
// @route Delete /api/v1/categories/:id
// @access Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const deleteCategory = await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Category Deleted Successfully!",
  });
});
