import mongoose from "mongoose";

const IpSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ip || mongoose.model("Ip", IpSchema);
