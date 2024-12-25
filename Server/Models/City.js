import mongoose from "mongoose";
const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "state",
      required: true,
    },
  },
  { timestamps: true }
);
const CityModel = mongoose.model("city", CitySchema);
export default CityModel;