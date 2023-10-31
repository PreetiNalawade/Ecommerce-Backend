//product schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL", "XXXL"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    //Admin
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [
      {
        type: String,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
//Virtuals
ProductSchema.virtual("qtyLeft").get(function () {
  const product = this;
  return product.totalQty - this.totalSold;
});
//Total Rating
ProductSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product?.reviews?.length;
});

//Average Rating
ProductSchema.virtual("averageRating").get(function () {
  let totalRatings = 0;
  const product = this;
  product?.reviews?.forEach((review) => {
    totalRatings += review?.rating;
  });
  // calc avg ratings
  const avgRating = totalRatings / product?.reviews?.length;
  return avgRating;
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
