import User from "../models/user.model.js";
import Notification from "../models/notifications.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import createNotification from "../lib/notificationHelper.js";

export const getWhoToFollow = async (req, res) => {
  try {
    const userId = req.Id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!userId)
      return res.status(401).json({ message: "User Unauthenticated" });

    const user = await User.findById(userId);
    const following = user.following;

    if (!user) return res.status(404).json({ message: "User not found" });

    const suggestedUsers = await User.find({
      _id: { $nin: [...following, userId] },
    })
      .limit(limit)
      .skip(skip);

    res.status(200).json(suggestedUsers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCreatorsForYou = async (req, res) => {
  try {
    const userId = req.Id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!userId)
      return res.status(401).json({ message: "User Unauthenticated" });

    const user = await User.findById(userId);
    const following = user.following;

    if (!user) return res.status(404).json({ message: "User not found" });

    const suggestedUsers = await User.find({
      _id: { $nin: [...following, userId] },
    })
      .limit(limit)
      .skip(skip)
      .sort({ followers: -1 });

    res.status(200).json(suggestedUsers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCreatorsYouFollow = async (req, res) => {
  try {
    const userId = req.Id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!userId)
      return res.status(401).json({ message: "User Unauthenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const following = user.following;

    if (following.length === 0)
      return res
        .status(400)
        .json({ message: "User is not following anyone yet." });

    const suggestedUsers = await User.find({ _id: { $in: following } })
      .limit(limit)
      .skip(skip);

    res.status(200).json(suggestedUsers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const visitorId = req.Id;

    const user = await User.findOne({ username }).select(
      "-password -roles -refreshToken -email"
    );
    if (!user) return res.status(401).json({ message: "User not found" });

    const visitor = await User.findById(visitorId);
    if (!visitor)
      return res
        .status(403)
        .json({ message: "Visiting User is unauthenticated" });

    res.status(200).json({ user, visitor });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.Id;

    const user = await User.findById(userId).select(
      "-roles -refreshToken -email"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name,
      username,
      img,
      coverImg,
      bio,
      location,
      currentPassword,
      newPassword,
    } = req.body;

    let imgUrl;
    let coverImgUrl;

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

    if ((newPassword && !currentPassword) || (currentPassword && !newPassword))
      return res.status(400).json({
        message: "Please provide both current password and new password",
      });

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "Your current password is incorrect." });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    if (coverImg) {
      if (user.coverImg) {
        const result = await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
        console.log("Deleted old image: ", result);
      }
      const uploadResponse = await cloudinary.uploader
        .upload(coverImg, {
          ...cloudinaryOptions,
          transformation: [
            ...cloudinaryOptions.transformation,
            { effect: "improve" },
          ],
        })
        .catch((e) => {
          console.error("Error uploading cover image: ", e);
          return res.status(400).json({ error: "Cover image is the problem" });
        });
      coverImgUrl = uploadResponse.secure_url;

      user.coverImg = coverImgUrl;
    }

    if (img) {
      if (user.img) {
        const result = await cloudinary.uploader.destroy(
          user.img.split("/").pop().split(".")[0]
        );
        console.log("Deleted old avatar image: ", result);
      }
      const uploadResponse = await cloudinary.uploader.upload(img, {
        ...cloudinaryOptions,
        transformation: [
          ...cloudinaryOptions.transformation,
          { effect: "improve" },
        ],
      });
      imgUrl = uploadResponse.secure_url;

      user.img = imgUrl;
    }

    if (name) {
      user.name = name;
    }
    if (username) {
      user.username = username;
    }
    if (bio) {
      user.bio = bio;
    }
    if (location) {
      user.location = location;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleFollowUnfollowUser = async (req, res) => {
  try {
    const userId = req.params.userId; // User to be followed
    const followingUserId = req.Id; // User that is sending a follow request

    const userToBeFollowed = await User.findById(userId);
    if (!userToBeFollowed)
      return res.status(404).json({ message: "User to follow not found" });
    const followingUser = await User.findById(followingUserId);
    if (!followingUser)
      return res.status(404).json({ message: "User following not found" });

    if (userId === followingUserId) {
      return res
        .status(400)
        .json({ message: "Users cannot follow themselves" });
    }

    const isFollowed = followingUser.following.includes(userId);

    if (isFollowed) {
      await User.updateOne(
        { _id: followingUserId },
        { $pull: { following: userId } }
      );
      await User.updateOne(
        { _id: userId },
        { $pull: { followers: followingUserId } }
      );

      const updatedUser = await User.findById(followingUserId);
      const updatedFollowings = updatedUser.following;

      res.status(200).json(updatedFollowings);
    } else {
      followingUser.following.push(userId);
      userToBeFollowed.followers.push(followingUserId);
      await followingUser.save();
      await userToBeFollowed.save();

      const notification = new Notification({
        from: followingUserId,
        to: userId,
        type: "follow",
      });
      await notification.save();

      res.status(200).json(followingUser.following);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
