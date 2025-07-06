import Post from "../models/post.model.js";

const increaseViews = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );

    next();
  } catch (e) {
    console.error(e);
    throw new Error("Failed to increase views");
  }
};

export default increaseViews;
