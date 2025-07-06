import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    img: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Editor: Number,
      Admin: Number,
    },
    bookmarkedPosts: {
      type: [String],
      default: [],
    },
    createdPosts: {
      type: [String],
      default: [],
    },
    likedPosts: {
      type: [String],
      default: [],
    },
    repostedPosts: {
      type: [String],
      default: [],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    refreshToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
