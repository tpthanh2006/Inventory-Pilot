const express = require("express");
const { upload } = require("../utils/fileUpload");
const { protect, adminOnly, staffOnly, verifiedOnly } = require("../middleware/authMiddleware");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const router = express.Router();

router.post("", protect, upload.single("image"), createProduct);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/", protect, staffOnly, getProducts);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;