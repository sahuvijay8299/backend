const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: Object,
      required: true,
    },
    quantity: {
      type: Number,
    },
    },
  
  { timestamps: true },
);

// model for cart
const cartsdb = new mongoose.model("carts", cartSchema);
module.exports = cartsdb;
