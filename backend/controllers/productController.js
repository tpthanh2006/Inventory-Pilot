const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create a Product
const createProduct = asyncHandler (async(req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Handle File Upload
  let fileData = {};
  if (req.file) {
    // Save image to Cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "Inventory Pilot",
          resource_type: "image"
        }
      )
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    }
  }

  // Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData
  });

  res.status(201).json(product);
});

// Get All Products
const getProducts = asyncHandler(async(req, res) => {
  const products = await Product
    .find({ user: req.user.id })
    .sort("-createdAt");
    
  res.status(200).json(products);
});

module.exports = {
  createProduct,
  getProducts
}