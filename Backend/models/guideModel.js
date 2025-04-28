import mongoose from "mongoose";

const guideApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending | approved | rejected
  },
  { timestamps: true }
);

export default mongoose.model("GuideApplication", guideApplicationSchema);
