import cloudinary from "../config/cloudinary.js";
import { catchAsyncError } from "../utils/catchAsyncError.js"
import { errorHandler } from '../utils/errorHandler.js';


export const uploadImage = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  if (!file) return next(errorHandler(400, "No image provided"));
  const stream = cloudinary.uploader.upload_stream(
    { folder: "products" },
    (error, result) => {
      if (error) return next(errorHandler(500, "Cloudinary upload failed"));
      res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
      });
    }
  );

  stream.end(file.buffer);
});