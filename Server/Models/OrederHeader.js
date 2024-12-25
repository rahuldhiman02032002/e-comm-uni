import mongoose from "mongoose";

const OrderHeaderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "country", // Linked to Country model
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "state", // Linked to State model
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "city", // Linked to City model
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "Pending", // Default status
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    transactionId: {
      type: String,
      required: true, // Make it required if every order must have a transaction
    },
  },
  { timestamps: true }
);

const OrderHeader = mongoose.model("OrderHeader", OrderHeaderSchema);

export default OrderHeader;
