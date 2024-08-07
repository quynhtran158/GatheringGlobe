import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  stream?: mongoose.Types.ObjectId;
  imageUrl?: string;
  bio?: string;
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unqiue: true },
  password: { type: String, required: false },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stream",
    required: false,
  },
  imageUrl: { type: String, required: false },
  bio: { type: String, required: false },
});

// Middleware for mongodb
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
