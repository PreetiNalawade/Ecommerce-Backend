import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
import Stripe from "stripe";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import {
  globalErrorHandler,
  notFound,
} from "../middlewares/globalErrorHandler.js";
import productsRouter from "../routes/productsRoute.js";
import categoryRouter from "../routes/categoryRoute.js";
import brandRouter from "../routes/brandRoute.js";
import colorRouter from "../routes/colorRoute.js";
import reviewRouter from "../routes/reviewRoute.js";
import orderRouter from "../routes/orderRoute.js";
import couponsRouter from "../routes/couponsRoute.js";
import Order from "../model/Order.js";

dbConnect();
const app = express();

app.use(cors());

//Stripe Webhook
//Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_656560292cb4b9875946f8ef430576cb524edc40d2a33b8f1e8af3fce95685a7";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      // Find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      console.log(order);
    } else {
      return;
    }
    // // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//Pass incoming data
app.use(express.json());

//routes
app.use("/", userRoutes);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/color", colorRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/coupons", couponsRouter);

//Err middleware
app.use(notFound);
app.use(globalErrorHandler);
export default app;
