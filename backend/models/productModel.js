const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    default: "SKU",
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Please add a quantity"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    trim: true,
  },
  image: {
    type: Object,
    default: {},
  },
  description: {
    type: String,
    maxLength: [250, "Description must not be more than 250 characters"],
    default: "New Product",
  },
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;