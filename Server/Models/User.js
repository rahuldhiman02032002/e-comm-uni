import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "country",
      required: true,
    }, // Linked to Country
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "state",
      required: true,
    }, // Linked to State
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "city",
      required: true,
    }, // Linked to City

    profilePic: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("user", UserSchema);
export default UserModel;
