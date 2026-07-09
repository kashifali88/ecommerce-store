import Product from "../models/ProductModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import Category from '../models/categoryModel.js'

// -------------------------------------ADMIN ONLY -----------------------------------------------------------------------

// create
export const createProduct = catchAsyncError(async (req, res, next) => {
  const { productName, description, price, stock, category, images } = req.body;

  if (
    !productName ||
    !description ||
    !price ||
    !stock ||
    !category ||
    !images?.length
  ) {
    return next(errorHandler(400, "please fill all fields"));
  }

  const product = await Product.findOne({ productName });

  if (product) {
    return next(errorHandler(400, "Product already exists"));
  }

  const newProduct = await Product.create({
    productName,
    description,
    price,
    stock,
    category,
    images,
  });

  res.status(201).json({
    success: true,
    message: "Product created",
    product: newProduct,
  });
});

// update
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { productName, description, price, stock, category, images } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: { productName, description, price, stock, category, images } },
    { new: true },
  );
  if (!updateProduct) return next(errorHandler(404, "Product not found"));
  await updatedProduct.save();
  res
    .status(201)
    .json({
      success: true,
      message: "Product updated",
      product: updatedProduct,
    });
});

// handle delete product
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) return next(errorHandler(404, "Product not found"));
  res
    .status(200)
    .json({
      success: true,
      message: "Product deleted",
      product: deletedProduct,
    });
});

// ------------------------------------------------------USER-------------------------------------------------------------//

// fetch all product
export const fetchAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({ success: true, products });
});
// fetch by category
export const fetchProductsByCategory = catchAsyncError(async(req, res, next) => {
  const { category } = req.params;
  const findCategory = await Category.findOne({name:category});
  if (!findCategory) return next(errorHandler(404, 'Category not found'))
    const products = await Product.find({category:findCategory._id}).populate('category')
  res.status(200).json({success:true, products})
})

// fetch single
export const fetchSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(errorHandler(404, "Product not found"));
  res.status(200).json({ success: true, product });
});

// search products
export const searchProducts = catchAsyncError(async (req, res, next) => {
  const { query } = req.query;
  if (!query || query.trim() === "") return next(errorHandler(400, "Please provide a search query"));
  const products = await Product.find({
    $or: [
      { productName: { $regex: query, $options: "i"}},
      { description: { $regex: query, $options: "i" }},
    ]
  }).populate("category")
  res.status(200).json({success:true, products})
})
