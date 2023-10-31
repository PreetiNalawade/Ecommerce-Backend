import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";

// @desc Create new prders
// @route POST /api/v1/orders
// @access Private

//Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  // const { coupon } = req?.query;

  // const couponFound = await Coupon.findOne({
  //   code: coupon?.toUpperCase(),
  // });
  // if (couponFound?.isExpired) {
  //   throw new Error("Coupon has expired!");
  // }
  // if (!couponFound) {
  //   throw new Error("Coupon no more exits!");
  // }

  //get discount
  //const discount = couponFound?.discount / 100;
  //Get the payload(customer,orderItems,shippingAddress,totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide Shipping Address");
  }
  if (orderItems?.length <= 0) {
    //Check if order is not empty
    throw new Error("No order items!");
  }
  //Place /Create order and save to DB
  const order = await Order.create({
    user: user?.id,
    orderItems,
    shippingAddress,
    //totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
  });
  //console.log(order);
  //Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //Push order into User
  user.orders.push(order?._id);
  await user.save();
  //MAke payment (Stripe)
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send({ url: session.url });
});

//@desc get all orders
//@route GET /api/v1/orders
//@access private
export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single orders
//@route GET /api/v1/orders/:id
//@access private
export const getSingleOrder = asyncHandler(async (req, res) => {
  //find single order
  const order = await Order.findById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Single order fetched successfully!",
    order,
  });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin
export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //find single order
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.json({
    success: true,
    message: "Order Updated!",
    order,
  });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin
export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
