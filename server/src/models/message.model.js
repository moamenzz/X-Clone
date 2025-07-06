import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

// Method to get unread count
messageSchema.statics.getUnreadCount = async function (userId, recipientId) {
  return this.countDocuments({
    sender: recipientId,
    recipient: userId,
    read: false,
  });
};

export default mongoose.model("Message", messageSchema);
