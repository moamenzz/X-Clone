import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import HiddenChat from "../models/hiddenchat.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllChatHeads = async (req, res) => {
  try {
    const userId = req.Id;

    const [user, hiddenChats] = await Promise.all([
      User.findById(userId),
      HiddenChat.findOne({ userId }),
    ]);

    if (!user) return res.status(404).send({ error: "User not found" });

    const visibleUsers = await User.find({
      _id: {
        $in: user.following,
        $ne: userId,
        $nin: hiddenChats?.hiddenUsers || [],
      },
    }).select("-password -roles -refreshToken -email");

    const chatHeads = await Promise.all(
      visibleUsers.map(async (followedUser) => {
        const [lastMessage, unreadCount] = await Promise.all([
          Message.findOne({
            $or: [
              { sender: userId, recipient: followedUser._id },
              { sender: followedUser._id, recipient: userId },
            ],
          }).sort({ createdAt: -1 }),
          Message.countDocuments({
            sender: userId,
            recipient: followedUser._id,
            read: false,
          }),
        ]);

        return {
          ...followedUser.toObject(),
          lastMessage: lastMessage?.message,
          lastMessageTime: lastMessage?.createdAt,
          unreadCount,
        };
      })
    );

    chatHeads.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    res.status(200).json(chatHeads);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.Id;
    const recipientId = req.params.recipientId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not Found" });

    const recipient = await User.findById(recipientId);
    if (!recipient)
      return res.status(404).json({ error: "Recipient not Found" });

    const chatHistory = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });

    const updatedMessage = await Message.updateMany(
      { sender: userId, recipient: recipientId },
      { read: true }
    );

    res.status(200).json(chatHistory);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleSendMessage = async (req, res) => {
  try {
    const userId = req.Id;
    const recipientId = req.params.recipientId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not Found" });

    const recipient = await User.findById(recipientId);
    if (!recipient)
      return res.status(404).json({ error: "Recipient not Found" });

    const { text, img } = req.body;
    if (!text || text.length > 255)
      return res.status(400).json({ error: "Text is too long or empty" });

    let imgUrl;

    const cloudinaryOptions = {
      folder: "x_posts",
      upload_preset: "x_posts",
      allowed_formats: ["jpg", "png", "webp", "jpeg"],
      resource_type: "image",
      transformation: [
        { quality: "auto:best" },
        { fetch_format: "auto" },
        { format: "webp" },
        {
          width: 1200,
          height: 630,
          crop: "fill",
          gravity: "auto",
        },
      ],
    };

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img, {
        ...cloudinaryOptions,
        transformation: [
          ...cloudinaryOptions.transformation,
          { effect: "improve" },
        ],
      });
      imgUrl = uploadResponse.secure_url;
    }

    const message = new Message({
      sender: userId,
      recipient: recipientId,
      message: text,
      img: imgUrl,
    });
    const newMessage = await message.save();

    res.status(200).json(newMessage);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleDeleteMessage = async (req, res) => {
  try {
    const userId = req.Id;
    const { messageId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (message.sender.toString() !== userId)
      return res.status(403).json({
        error: "You only have permission to delete your own messages.",
      });

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    res.status(200).json({ success: "Message deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const hideChat = async (req, res) => {
  try {
    const userId = req.Id;
    const userToHide = req.params.userId;

    // Find or create hidden chats document
    let hiddenChats = await HiddenChat.findOne({ userId });
    if (!hiddenChats) {
      hiddenChats = new HiddenChat({
        userId,
        hiddenUsers: [],
      });
    }

    // Add user to hidden list if not already there
    if (!hiddenChats.hiddenUsers.includes(userToHide)) {
      hiddenChats.hiddenUsers.push(userToHide);
      await hiddenChats.save();
    }

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const unhideChat = async (req, res) => {
  try {
    const userId = req.Id;
    const userToUnhide = req.params.userId;

    // Remove user from hidden list
    await HiddenChat.updateOne(
      { userId },
      { $pull: { hiddenUsers: userToUnhide } }
    );

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};
