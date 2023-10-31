import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

// @desc Create new Product
// @route POST /api/v1/products
// @access Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
  const convertedImgs = req.files.map((file) => file.path);
  console.log(convertedImgs);
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;
  //Brand Exists?
  // find the brand - associate product with brand
  const brandFound = await Brand.findOne({ name: brand });
  console.log(brandFound);
  if (!brandFound) {
    throw new Error(
      "Brand not found!!Please create the Brand or check the name!"
    );
  }

  //Product Exists?
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error(" Product Already exits!");
  }
  // find the category - associate product with category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error(
      "Category not found!!Please create the category or check the name!"
    );
  }

  //create Product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImgs,
  });
  //after asscociation - Push the product into category
  categoryFound.products.push(product._id);
  categoryFound.save();

  //after asscociation - Push the product into brand
  brandFound.products.push(product._id);
  brandFound.save();

  res.json({
    status: "success",
    message: " Product created successfully ",
    product,
  });
});

// @desc Get All  Product
// @route GET /api/v1/products
// @access Public
export const getProductsCtrl = asyncHandler(async (req, res) => {
  //Query
  let productQuery = Product.find();
  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }
  //search by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }
  //search by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }
  //search by colors
  if (req.query.colors) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: "i" },
    });
  }
  //search by sizes
  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }

  // Filter by Range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    // gte and lte
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }
  //Pagination, page, limit, startIndex, endIndex,total
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIndex
  const startIndex = (page - 1) * limit;
  //EndIndex
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  //await the query - when we use await we cannot make any operations
  const products = await productQuery.populate("reviews");
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully!",
    products,
  });
});

// @desc Get Single  Product
// @route GET /api/v1/products/:id
// @access Public

export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error("Product not found");
  }
  res.json({
    status: "success",
    message: "Product fetch successfully",
    product,
  });
});

// @desc Update Product
// @route PUT /api/v1/products/:id/update
// @access Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalOty,
    brand,
  } = req.body;

  // Update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalOty,
      brand,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Products Updated fetch successfully",
    product,
  });
});

// @desc Delete Product
// @route DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Product Deleted successfully",
  });
});
