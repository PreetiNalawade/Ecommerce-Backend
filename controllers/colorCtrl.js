import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

// @desc Create new Color
// @route POST /api/v1/color
// @access Private/Admin
export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //Color check
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("Color already exists!");
  }
  //create category
  const color = await Color.create({
    name,
    user: req.userAuthId,
  });
  res.json({
    status: " Success",
    message: "Color created successfully!",
    color,
  });
});

// @desc Get All Colors
// @route GET /api/v1/color
// @access Public
export const getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();

  res.json({
    status: "Success",
    message: "All Colors fetched successfully!",
    colors,
  });
});

// @desc Get Color by ID
// @route GET /api/v1/Color/:id
// @access Public
export const getSingleColorCtrl = asyncHandler(async (req, res) => {
  const singleColor = await Color.findById(req.params.id);
  if (!singleColor) {
    throw new Error(" No Color found!");
  }
  res.json({
    status: "success",
    message: "Color found successfully!",
    singleColor,
  });
});

// @desc Update Color
// @route Put /api/v1/color/:id
// @access Public
export const updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const updateColor = await Color.findByIdAndUpdate(
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
    message: "Color updated Successfully!",
    updateColor,
  });
});

// @desc Delete Color
// @route Delete /api/v1/Color/:id
// @access Admin
export const deleteColorCtrl = asyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Color Deleted Successfully!",
  });
});
