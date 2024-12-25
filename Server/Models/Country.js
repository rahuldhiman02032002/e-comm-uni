import mongoose from "mongoose";
const CountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timeseries: true }
);
const CountryModel = mongoose.model("country", CountrySchema);
export default CountryModel;