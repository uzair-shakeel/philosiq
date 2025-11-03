import mongoose from "mongoose";

const UsernameSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Username || mongoose.model("Username", UsernameSchema);
