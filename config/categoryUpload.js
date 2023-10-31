import cloudinaryPackage from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

//configure cloudinary
const cloudinary = cloudinaryPackage.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

// Create storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "category",
  },
});

// Init Multer with the storage engine
const categoryUpload = multer({ storage: storage });

export default categoryUpload;
