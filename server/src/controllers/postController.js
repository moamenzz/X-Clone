import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import createNotification from "../lib/notificationHelper.js";
import mongoose from "mongoose";

export const getForYouPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("user", "username name img"); // Add this to get user details

    return res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getFollowingsPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const userId = req.Id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User unauthenticated" });
    }

    const followings = user.following;
    if (!followings || user.following.length === 0) {
      return res
        .status(400)
        .json({ error: "User is not following anyone yet" });
    }

    const posts = await Post.find({ user: { $in: user.following } })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("user", "username name img"); // Add this to get user details

    if (!posts || posts.length === 0) {
      return res.status(400).json({ error: "User's followings have no posts" });
    }

    return res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getBookmarkedPosts = async (req, res) => {
  try {
    const userId = req.Id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const bookmarks = await Post.find({ _id: { $in: user.bookmarkedPosts } })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("user", "username name img");

    res.status(200).json(bookmarks);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.Id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("user", "username name img");

    res.status(200).json(likedPosts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getReposts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const postId = req.params.postId;

    const post = await Post.findById(postId)
      .select("reposts")
      .populate("reposts", "username name img");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reposts = post.reposts;

    res.status(200).json(reposts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const postId = req.params.postId;

    const post = await Post.findById(postId)
      .select("comments")
      .populate("comments.user", "username name img");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.comments;

    res.status(200).json(comments);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleCreatePost = async (req, res) => {
  try {
    const userId = req.Id;
    const { text, img } = req.body;

    let imgUrl;

    if (!text && !img)
      return res.status(400).json({ error: "Post must have content" });

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

    const user = await User.findById(userId);

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

    const newPost = new Post({
      user: userId,
      text,
      img: imgUrl,
    });
    const savedPost = await newPost.save();

    res.status(200).json(savedPost);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleLikeUnlikePost = async (req, res) => {
  try {
    const userId = req.Id;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const postAuthorId = post.user;

    const likedPost = post.likes.includes(userId);

    if (likedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: userId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      user.likedPosts.push(postId);
      await post.save();
      await user.save();

      await createNotification(userId, postAuthorId, "like");

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleRepost = async (req, res) => {
  try {
    const userId = req.Id;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const postAuthorId = post.user;

    const isReposted = user.repostedPosts.includes(postId);

    if (isReposted) {
      await Post.updateOne({ _id: postId }, { $pull: { reposts: userId } });
      await User.updateOne(
        { _id: userId },
        { $pull: { repostedPosts: postId } }
      );

      const updatedReposts = post.reposts.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedReposts);
    } else {
      post.reposts.push(userId);
      user.repostedPosts.push(postId);
      await post.save();
      await user.save();

      await createNotification(userId, postAuthorId, "repost");

      const updatedReposts = post.reposts;
      res.status(200).json(updatedReposts);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleComment = async (req, res) => {
  try {
    const { text, img } = req.body;
    const userId = req.Id;
    const postId = req.params.postId;

    if (!text)
      return res.status(400).json({ error: "Comment requires content" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const postAuthorId = post.user;

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

    const comment = {
      user: userId,
      text,
      img: imgUrl,
      _id: new mongoose.Types.ObjectId(), // Explicitly create new ObjectId
    };

    post.comments.push(comment);
    await post.save();

    await createNotification(userId, postAuthorId, "comment");

    res.status(200).json(post);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleBookmark = async (req, res) => {
  try {
    const userId = req.Id;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const isBookmarked = user.bookmarkedPosts.includes(postId);

    if (isBookmarked) {
      await User.updateOne(
        { _id: userId },
        { $pull: { bookmarkedPosts: postId } }
      );

      const updatedBookmarks = user.bookmarkedPosts.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedBookmarks);
    } else {
      user.bookmarkedPosts.push(postId);
      await user.save();

      // Add notifications here

      const updatedBookmarks = user.bookmarkedPosts;
      res.status(200).json(updatedBookmarks);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleDeletePost = async (req, res) => {
  try {
    const userId = req.Id;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (post.img) {
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(postId);
    await User.updateOne(
      { _id: userId },
      {
        $pull: {
          posts: postId,
          likedPosts: postId,
          repostedPosts: postId,
          bookmarkedPosts: postId,
        },
      }
    );

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleDeleteComment = async (req, res) => {
  try {
    const userId = req.Id;
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const comment = post.comments._id(commentId);
    if (!comment) return res.status(400).json({ error: "Comment not found" });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.updateOne(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};
