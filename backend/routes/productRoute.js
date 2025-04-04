const express = require("express");
const { upload } = require("../utils/fileUpload");
const protect = require("../middleware/authMiddleware");
const { createProduct } = require("../controllers/productController");
const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);

module.exports = router;