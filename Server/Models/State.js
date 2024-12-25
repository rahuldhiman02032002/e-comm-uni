import mongoose from "mongoose";
const StateSchem = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "country",
      required: true,
    },
  },
  { timestamps: true }
);
const StateModel = mongoose.model("state", StateSchem);
export default StateModel;
