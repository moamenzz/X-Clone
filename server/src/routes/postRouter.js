import express from "express";
import {
  getBookmarkedPosts,
  getFollowingsPosts,
  getForYouPosts,
  getLikedPosts,
  getPostComments,
  getReposts,
  handleBookmark,
  handleComment,
  handleCreatePost,
  handleDeleteComment,
  handleDeletePost,
  handleLikeUnlikePost,
  handleRepost,
} from "../controllers/postController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const postRouter = express.Router();

postRouter.get("/for-you", getForYouPosts);
postRouter.get("/followings", verifyJWT, getFollowingsPosts);
postRouter.get("/bookmarks", verifyJWT, getBookmarkedPosts);
postRouter.get("/liked-posts", verifyJWT, getLikedPosts);
postRouter.get("/reposts/:postId", verifyJWT, getReposts);
postRouter.get("/comments/:postId", verifyJWT, getPostComments);
postRouter.post("/create-post", verifyJWT, handleCreatePost);
postRouter.post("/comment/:postId", verifyJWT, handleComment);
postRouter.put("/like/:postId", verifyJWT, handleLikeUnlikePost);
postRouter.put("/repost/:postId", verifyJWT, handleRepost);
postRouter.put("/bookmark/:postId", verifyJWT, handleBookmark);
postRouter.delete("/delete-post/:postId", verifyJWT, handleDeletePost);
postRouter.delete(
  "/delete-comment/:postId/:commentId",
  verifyJWT,
  handleDeleteComment
);

export default postRouter;
