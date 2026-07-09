import Category from "../models/categoryModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";


//-----------------------------------------------ADMIN ONLY -------------------------------------------------//
// create
export const createCategory = catchAsyncError(async(req, res, next) => {
        const { name,image } = req.body;
        const category = await Category.findOne({name});
        if (category) return next(errorHandler(400, 'Category already exists!'));
        const newCategory = await Category.create({name, image});
        await newCategory.save();
        res.status(201).json({success:true, message:'Category created successfully', category:newCategory});
   
})
// update 
export const updateCategory = catchAsyncError(async(req, res, next) => {
    const { name, image } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, {$set: {name, image}}, {new:true});
    if(!category) return next(errorHandler(404, "Category not found"));
    res.status(200).json({success:true, message:"Category updated", category});
})

// delete
export const deleteCategory = catchAsyncError(async(req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if(!category) return next(errorHandler(404, "Category not found"));
    res.status(200).json({success:true, message:"Category deleted"})
})

//-----------------------------------------------USER ONLY -------------------------------------------------//

// fetch
export const fetchAllCategory = catchAsyncError(async(req, res, next) => {
    const category = await Category.find({});
    res.status(200).json({success:true, category});
});

// fetch single
export const fetchSingleCategory = catchAsyncError(async(req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(errorHandler(404, 'Category not found'));
    res.status(200).json({success:true, category});

})


