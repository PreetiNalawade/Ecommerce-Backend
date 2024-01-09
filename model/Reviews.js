import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

const ReviewsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product!"],
    },
    message: {
      type: String,
      //required: [true, "Please add a message"],
    },
    rating: {
      type: Number,
      //required: [true, "Please add ratings between 1-5"],
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", ReviewsSchema);

export default Reviews;
