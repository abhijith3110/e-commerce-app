import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    grand_total: {
      type: Number,
      required: true,
    },

    payment: {
      stripe_id: {
        type: String,
        required: true,
      },
      paid_at: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
  },

  {
    timestamps: true,
  }
  
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
