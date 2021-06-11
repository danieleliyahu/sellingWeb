import mongoose from "mongoose";
const userReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    comment: { type: String, required: true },
    rating: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
      reviews: [userReviewSchema],
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
