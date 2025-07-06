import mongoose from "mongoose";

const hiddenChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hiddenUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const HiddenChatModel = mongoose.model("HiddenChat", hiddenChatSchema);

export default HiddenChatModel;
