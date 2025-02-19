import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
  },

  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
