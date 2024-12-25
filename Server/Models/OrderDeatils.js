import mongoose from "mongoose";

const OrderDetailsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderHeader", // Linked to OrderHeader model
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Linked to Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true, // Price of the product at the time of order
    },
    total: {
      type: Number,
      required: true, // Calculated as quantity * price
    },
  },
  { timestamps: true }
);

const OrderDetails = mongoose.model("OrderDetails", OrderDetailsSchema);

export default OrderDetails;
