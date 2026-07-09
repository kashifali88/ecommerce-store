import express from 'express';
import upload from '../middleware/upload.js';
import { uploadImage } from '../controllers/uploadController.js';

const uploadRouter = express.Router();

uploadRouter.post("/upload",upload.single("file"), uploadImage)

export default uploadRouter;